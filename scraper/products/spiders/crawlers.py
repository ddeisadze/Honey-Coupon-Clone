import scrapy
from scrapy.loader import ItemLoader
import re
import json
from urllib.parse import urlencode
from urllib.parse import urljoin

from products.items import AmazonProductItem

# class Product(scrapy.Item):
#     name = scrapy.Field()
#     price = scrapy.Field()
#     stock = scrapy.Field()
#     tags = scrapy.Field()
#     last_updated = scrapy.Field(serializer=str)


class SlickDeals(scrapy.Spider):
    name = "slickdeals-computerdeals"

    def start_requests(self):
        url = "https://slickdeals.net/computer-deals"
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response, **kwargs):
        # l = ItemLoader(item=Product(), response=response)
        items_on_page = response.css("ul.dealTiles li")
        # css(".bp-c-button--link::text").get()


def parse_tables(response):
    # Define a list to store the parsed tables
    tables = []

    # Extract all table elements from the HTML
    elements = response.xpath('//table')

    # Iterate over the table elements and parse them
    for element in elements:
        try:
            table = parse_table(element)
            if table:
                table_id = "-".join(element.xpath(
                    './ancestor-or-self::div/@id').extract()[-3:])
                tables.append({"id": table_id, "data": table})
        except Exception as e:
            pass

    # Return the list of parsed tables
    return tables


def parse_table(table):
    # Define a dictionary to store the parsed values
    data = {}

    # Extract the rows from the table
    rows = table.xpath('./tr')
    if len(rows) == 0:
        return None

    def clean_list_of_null_values(list_of_values):
        return [i for i in list_of_values if i.strip()]

    # Extract the headers from the first row
    headers = clean_list_of_null_values(rows[0].xpath(
        './th/descendant-or-self::text()').extract())
    # Check if the headers are in th elements or td elements
    if headers:
        # If the headers are in th elements, use them as keys
        for i, header in enumerate(headers):
            data[str(header)] = []
        # Iterate over the remaining rows and extract the values
        for row in rows[1:]:
            values = clean_list_of_null_values(
                row.xpath('./td/text() | ./td/descendant-or-self::span/text()').extract())
            for i, value in enumerate(values):
                data[str(headers[i])].append(value)
    else:
        # If the headers are not present, use the indices as keys
        for row in rows:
            values = clean_list_of_null_values(
                row.xpath('./td/descendant-or-self::span/text()').extract())

            for i, value in enumerate(values):
                if i not in data:
                    data[str(i)] = []
                data[str(i)].append(value)

    # Return the dictionary as a JSON string
    if (len(data) > 0):
        return data
    return None


class AmazonSearchToProductPage(scrapy.Spider):
    """Works only on search pages and some category pages"""
    name = 'amazon_search'
    search_terms = ["best seller electronics", "laptop", "bluetooth headphones",
                    "earbuds"]
    base_url = "www.amazon.com"
    current_search_term = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def start_requests(self):
        for term in self.search_terms:
            self.current_search_term = term
            url = 'https://www.amazon.com/s?' + urlencode({'k': term})
            yield scrapy.Request(url=url, callback=self.parse_keyword_response)

    def parse_keyword_response(self, response):
        products = response.xpath('//*[@data-asin]')

        for product in products:
            asin = product.xpath('@data-asin').extract_first()
            product_url = f"https://www.amazon.com/dp/{asin}"
            yield scrapy.Request(url=product_url, callback=parse_product_page, meta={'asin': asin})

        next_page = response.xpath(
            "//a[contains(@class, 's-pagination-next')]/@href").extract_first()

        if next_page:
            url = urljoin("https://www.amazon.com", next_page)
            yield scrapy.Request(url=url, callback=self.parse_keyword_response)

# class AmazonBestSellerList(scrapy.Spider):
#     name = 'amazon_best_seller_list'
#     base_url = "www.amazon.com"
#     best_seller_category_pages = []

#     def start_requests(self):
#         for term in self.best_seller_category_pages:
#             url = 'https://www.amazon.com/s?' + urlencode({'k': term})
#             yield scrapy.Request(url=url, callback=self.parse_keyword_response)


class AmazonProductPage(scrapy.Spider):
    name = 'amazon_page'
    base_url = "www.amazon.com"

    def __init__(self, asin, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.asin = asin

    def start_requests(self):
        url = f"https://www.amazon.com/dp/{self.asin}"
        yield scrapy.Request(url=url, callback=parse_product_page, meta={'asin': self.asin})


def parse_product_page(response):
    asin = response.meta['asin']
    product_url = f"https://www.amazon.com/dp/{asin}"
    title = response.xpath(
        '//*[@id="productTitle"]/text()').extract_first()
    try:
        image = re.search('"large":"(.*?)"', response.text).groups()[0]
    except:
        image = None

    rating = response.xpath('//*[@id="acrPopover"]/@title').extract_first()
    number_of_reviews = response.xpath(
        '//*[@id="acrCustomerReviewText"]/text()').extract_first()
    price_to_pay = response.xpath(
        "//span[contains(@class, 'priceToPay')]/span[contains(@class, 'a-offscreen')]//text()").extract_first()

    list_price = response.xpath(
        "//span[contains(@class, 'basisPrice')]/span[contains(@class, 'a-price')]//text()").extract_first()

    savingsPercentage = response.xpath(
        "//span[contains(@class, 'savingsPercentage')]//text()").extract_first()

    get_all_tables = parse_tables(response)

    # category
    # //*[@id="nav-subnav"]@data-category

    # parent //*[@id="nav-subnav"]
    # loop through children with a tag
    # then grab class nav-a-content and get its text value

    # this is not as good, because it can have back to search results
    # even better, get the category tree
    # to get the breadcrumb use //*[@id="wayfinding-breadcrumbs_feature_div"]/ul
    # grab each children using //*[@id="wayfinding-breadcrumbs_feature_div"]/ul/li[1]/span/a
    # then grab the text value

    if not price_to_pay:
        price_to_pay = response.xpath('//*[@data-asin-price]/@data-asin-price').extract_first() or \
            response.xpath(
                '//*[@id="price_inside_buybox"]/text()').extract_first()

    temp = response.xpath('//*[@id="twister"]')
    sizes = []
    colors = []
    if temp:
        try:
            s = re.search(
                '"variationValues" : ({.*})', response.text).groups()[0]
            json_acceptable = s.replace("'", "\"")
            di = json.loads(json_acceptable)
            sizes = di.get('size_name', [])
            colors = di.get('color_name', [])
        except:
            pass

    bullet_points = response.xpath(
        '//*[@id="feature-bullets"]//li/span/text()').extract()
    seller_rank = response.xpath(
        '//*[text()="Amazon Best Sellers Rank:"]/parent::*//text()[not(parent::style)]').extract()

    yield AmazonProductItem({'Id': asin, "IdType": "asin", 'Title': title, 'MainImage': image, 'Rating': rating, 'NumberOfReviews': number_of_reviews,
                             'PricePaid': price_to_pay, 'PriceList': list_price, 'PriceDiscount': savingsPercentage, 'AvailableSizes': sizes, 'AvailableColors': colors, 'Details': bullet_points,
                             'SellerRank': seller_rank, 'ProductUrl': product_url, 'AllTables': get_all_tables})


def extract_table_to_json(tbody):
    data = {}
    # Extract the tbody element containing the table rows

    # Iterate over the rows
    for row in tbody.css('tr'):
        # Extract the text of the th element (column name)
        column_name = row.css('th::text').extract_first()
        # Extract the text of the td element (column value)
        column_value = row.css('td::text').extract_first()
        # Add the parsed values to the dictionary
        data[column_name] = column_value

    # Convert the dictionary to a JSON string
    json_data = json.dumps(data)
    return json_data
