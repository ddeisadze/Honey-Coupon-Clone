import scrapy
from scrapy.loader import ItemLoader
import re
import json
from urllib.parse import urlencode
from urllib.parse import urljoin

from products.items import AmazonProductItem

# class SlickDeals(scrapy.Spider):
#     name = "slickdeals-computerdeals"

#     def start_requests(self):
#         url = "https://slickdeals.net/computer-deals"
#         yield scrapy.Request(url=url, callback=self.parse)

#     def parse(self, response, **kwargs):
#         # l = ItemLoader(item=Product(), response=response)
#         items_on_page = response.css("ul.dealTiles li")
#         # css(".bp-c-button--link::text").get()
