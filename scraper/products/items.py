# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AmazonProductItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    Id = scrapy.Field()
    IdType = scrapy.Field()
    Title = scrapy.Field()
    MainImage = scrapy.Field()
    Rating = scrapy.Field()
    NumberOfReviews = scrapy.Field()
    PricePaid = scrapy.Field()
    PriceList = scrapy.Field()
    PriceDiscount = scrapy.Field()
    AvailableSizes = scrapy.Field()
    AvailableColors = scrapy.Field()
    Details = scrapy.Field()
    SellerRank = scrapy.Field()
    ProductUrl = scrapy.Field()
    AllTables = scrapy.Field()
