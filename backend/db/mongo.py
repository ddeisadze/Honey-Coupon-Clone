import pymongo
from django.conf import settings
from datetime import datetime

class MongoDbDjango:
    def __init__(self):
        self.mongo_uri = f"mongodb://{settings.MONGO_USER}:{settings.MONGO_PASS}@{settings.MONGO_HOSTNAME}:{settings.MONGO_PORT}/"
        self.collection = settings.MONGO_COLLECTION
        try:
            self.client = pymongo.MongoClient(self.mongo_uri)
            self.db = self.client[settings.MONGO_DBNAME]
        except:
            print("Unable to connect to Mongodb.")
    
    def get_items_from_crawler(self, job_id, asin):
        products_crawler_collection = self.db[self.collection]
        item = products_crawler_collection.find_one({
            "spiderInfo.job_id" : job_id,
            "asin": asin
        })
        
        return item