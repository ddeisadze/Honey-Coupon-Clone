# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
import pymongo
from datetime import datetime
import json

# class ProductsPipeline:
#     def process_item(self, item, spider):
#         dictItem = dict(item)

#         CrawlerWriter.writeObject(item.asin, dictItem)


class DuplicatesPipeline:
    def __init__(self):
        self.ids_seen = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter['Id'] in self.ids_seen:
            raise DropItem(f"Duplicate item found: {item!r}")
        else:
            self.ids_seen.add(adapter['Id'])
            return item


class MongoPipeline:

    def __init__(self, mongo_host, mongo_db, mongo_port, mongo_collection, mongo_pass, mongo_user, skip=False):
        print(mongo_host, mongo_db, mongo_port, mongo_collection,
              mongo_pass, mongo_user, "mongo settings")
        self.mongo_uri = f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:{mongo_port}/"
        self.mongo_db = mongo_db
        self.mongo_collection = mongo_collection
        self.skip = skip

    @classmethod
    def from_crawler(cls, crawler):
        hostname = crawler.settings.get("MONGO_HOSTNAME")
        port = crawler.settings.get("MONGO_PORT")
        dbName = crawler.settings.get("MONGO_DBNAME")
        mongo_collection = crawler.settings.get("MONGO_COLLECTION")
        mongo_user = crawler.settings.get("MONGO_USER")
        mongo_pass = crawler.settings.get("MONGO_PASS")

        if not hostname or not port or not dbName or not mongo_collection or not mongo_pass or not mongo_user:
            print(ValueError("Missing Mongo settings"))
            return cls(None, None, None, None, None, None, skip=True)

        return cls(
            mongo_host=hostname,
            mongo_db=dbName,
            mongo_collection=mongo_collection,
            mongo_port=port,
            mongo_user=mongo_user,
            mongo_pass=mongo_pass,
        )

    def open_spider(self, spider):
        try:
            self.client = pymongo.MongoClient(self.mongo_uri)
            self.db = self.client[self.mongo_db]
        except:
            print("Unable to connect to Mongodb.")

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        if (self.skip):
            return item
        
        spider_info = {
            "name": spider.name,
        }
        
        if spider.name == 'amazon_search':
            spider_info['searchTerm'] = spider.current_search_term

        data_object = {"asin": item['Id'],
                       "sourceWebsite": spider.base_url,
                       "dateTimeCrawled": datetime.now(),
                       "crawledData": ItemAdapter(item).asdict(),
                       "spiderInfo": spider_info}

        self.db[self.mongo_collection].insert_one(data_object)
        return item


class DatabasePipeline:
    collection_name = 'scrapy_items'

    def __init__(self):
        self.writer = CrawlerWriterOracle()

    def close_spider(self, spider):
        self.writer.closeHandle()

    def process_item(self, item, spider):
        spider_info = {
            "name": spider.name,
        }
        if spider.name == 'amazon_search':
            spider_info['searchTerm'] = spider.searchTerm

        writeObject = dict(item)
        writeObject['spider'] = spider_info

        self.writer.writeObject(item['Id'], spider.base_url, **writeObject)
        return item
