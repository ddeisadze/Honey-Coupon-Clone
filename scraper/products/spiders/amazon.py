import scrapy
import re
import json
from urllib.parse import urlencode
from urllib.parse import urljoin

from products.items import AmazonProductItem
from products.utility import parse_out_all_tables_on_page


class AmazonSearchToProductPage(scrapy.Spider):
    """Works only on search pages and some category pages"""
    name = 'amazon_search'
    search_terms = ["best seller electronics", "laptop", "bluetooth headphones",
                    "earbuds"]
    base_url = "www.amazon.com"
    current_search_term = None

    def __init__(self, search_term=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.search_term = search_term

    def start_requests(self):
        if self.search_term:
            self.search_terms = [self.search_term]

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

class AmazonListOfProductPages(scrapy.Spider):
    name = "amazon_page_list"
    
    def __init__(self, urls=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        print(urls)
        print(args)
        print(kwargs)
        self.urls = urls.split(",")
    
    def start_requests(self):
        if self.urls and len(self.urls) > 0:
            for url in self.urls:
                yield scrapy.Request(url=url, callback=parse_product_page, meta={'url': url})
        
        print("No urls found.")
        return None

class AmazonProductPage(scrapy.Spider):
    name = 'amazon_page'
    base_url = "www.amazon.com"

    def __init__(self, asin=None, url=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.asin = asin
        self.url = url

    def start_requests(self):
        if self.url:
            url = self.url
        elif self.asin:
            url = f"https://www.amazon.com/dp/{self.asin}"
        else:
            raise ValueError("Either url or asin must be provided")

        yield scrapy.Request(url=url, callback=parse_product_page, meta={'asin': self.asin, 'url': self.url})


def parse_product_page(response):
    asin = None
    product_url = None

    if 'asin' in response.meta:
        asin = response.meta['asin']
        product_url = f"https://www.amazon.com/dp/{asin}"
    elif 'url' in response.meta:
        product_url = response.meta['url']
    else:
        raise ValueError("Either url or asin must be provided")

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

    get_all_tables = parse_out_all_tables_on_page(response)

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

    # check if there are any failures
    if not title:
        raise Exception("Could not extract out information from site.")

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
