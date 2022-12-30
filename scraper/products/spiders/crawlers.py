import scrapy
from scrapy.loader import ItemLoader
import re
import json
from urllib.parse import urlencode
from urllib.parse import urljoin
import logging

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


class AmazonListPage(scrapy.Spider):
    name = "amazon-list-page"

    def start_requests(self):
        url = "https://www.amazon.com/s?k=computer+deals&rh=n"
        yield scrapy.Request(url=url, callback=self.parse)

# crawl category page
#    get text, //*[(@id = "twotabsearchtextbox")] | //*[contains(concat( " ", @class, " " ), concat( " ", "a-text-normal", " " ))]
#


class AmazonTechnologySpider(scrapy.Spider):
    name = 'amazon_technology'
    start_urls = ["https://www.amazon.com/s?k=technology"]

    def __init__(self, *args, **kwargs):
        logger = logging.getLogger('scrapy.spidermiddlewares.httperror')
        logger.setLevel(logging.ERROR)
        super().__init__(*args, **kwargs)

    def start_requests(self):
        for query in self.start_urls:
            url = 'https://www.amazon.com/s?' + urlencode({'k': query})
            yield scrapy.Request(url=url, callback=self.parse_keyword_response)

    def parse_keyword_response(self, response):
        products = response.xpath('//*[@data-asin]')

        for product in products:
            asin = product.xpath('@data-asin').extract_first()
            product_url = f"https://www.amazon.com/dp/{asin}"
            yield scrapy.Request(url=product_url, callback=self.parse_product_page, meta={'asin': asin})

    def parse(self, response):
        products = response.xpath('//*[@data-asin]')
        for product in products:
            product_url = product.css(
                'a.s-access-detail-page::attr(href)').get()
            print(product_url)
            yield scrapy.Request(product_url, callback=self.parse_product_page)

        next_page = response.xpath(
            '//li[@class="a-last"]/a/@href').extract_first()

        if next_page:
            url = urljoin("https://www.amazon.com", next_page)
            yield scrapy.Request(url=url, callback=self.parse_keyword_response)

    def parse_product_page(self, response):
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
        # price = response.xpath(
        #     '//*[@id="priceblock_ourprice"]/text()').extract_first()
        price_to_pay = response.xpath(
            "//span[contains(@class, 'priceToPay')]/span[contains(@class, 'a-offscreen')]//text()").extract_first()

        list_price = response.xpath(
            "//span[contains(@class, 'basisPrice')]/span[contains(@class, 'a-price')]//text()").extract_first()

        savingsPercentage = response.xpath(
            "//span[contains(@class, 'savingsPercentage')]//text()").extract_first()

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
        yield {'asin': asin, 'Title': title, 'MainImage': image, 'Rating': rating, 'NumberOfReviews': number_of_reviews,
               'Price.pay': price_to_pay, 'Price.list': list_price, 'Price.discount': savingsPercentage, 'AvailableSizes': sizes, 'AvailableColors': colors, 'BulletPoints': bullet_points,
               'SellerRank': seller_rank, 'ProductUrl': product_url}
