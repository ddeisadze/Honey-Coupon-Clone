from borneo import PutRequest
from borneo import NoSQLHandle, NoSQLHandleConfig, Regions
from borneo.iam import SignatureProvider
import os
from datetime import datetime
import json


class OracleDbAuth:
    def __init__(self):
        self.credentials_file = os.path.join(
            os.path.dirname(os.path.realpath(__file__)), "config/settings.ini")
        self.at_provider = SignatureProvider(config_file=self.credentials_file)
        self.config = NoSQLHandleConfig(provider=self.at_provider)


class CrawlerWriter():
    def __init__(self):
        self.handle = None

    def writeObject(self, asin, sourceWebsite, **kwargs):
        raise NotImplementedError

    def closeHandle(self):
        raise NotImplementedError

class CrawlerWriterOracle(CrawlerWriter):
    def __init__(self):
        oracleDbAuth = OracleDbAuth()
        self.handle = NoSQLHandle(oracleDbAuth.config)

    def writeObject(self, asin, sourceWebsite, **kwargs):
        request = PutRequest().set_table_name("crawler")
        request.set_value(
            {"asin": asin, "sourceWebsite": sourceWebsite, "dateTimeCrawled": datetime.now(), "otherData": json.dumps(kwargs)})
        result = self.handle.put(request)
        if not result:
            raise Exception("Could not write to database")

    def closeHandle(self):
        self.handle.close()

# CrawlerWriter = _CrawlerWriter()

# CrawlerDb().writeObject("test", "test", test1="test")

# # if using a specified credentials file
# credentials_file = "C:\\Users\\tbili\\OneDrive\\Documents\\GitHub\\unboxr\\scraper\\products\\config\\settings.ini"

# #
# # Create an AuthorizationProvider
# #
# at_provider = SignatureProvider(config_file=credentials_file)

# #
# # create a configuration object
# #
# config = NoSQLHandleConfig(provider=at_provider)
# #
# # create a handle from the configuration object
# #
# handle = NoSQLHandle(config)


# # PutRequest requires a table name
# request = PutRequest().set_table_name('crawler')
# request.set_value({'id': "test", 'name': 'myname'})
# result = handle.put(request)
# print(result)
