# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AmazonProductItem(scrapy.Item):
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
    BrandName = scrapy.Field()
<<<<<<< HEAD
    Product_Categories = scrapy.Field()
=======
    Coupons = scrapy.Field()
>>>>>>> 9273def2fd80c157651568d4c11f734bd1e0f515
