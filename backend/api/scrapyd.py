import requests
from django.conf import settings
from requests_toolbelt.multipart.encoder import MultipartEncoder
import json

class ScrapydDjango:
    def __init__(self):
        scrapyd_host = settings.SCRAPYD_HOST_NAME
        scrapyd_port = settings.SCRAPYD_PORT
        
        self.scrapyd_username = settings.SCRAPYD_USERNAME
        self.scrapyd_password = settings.SCRAPYD_PASSWORD
        self.scrapyd_projects = settings.SCRAPYD_PROJECT
        
        self.scrapydUrl = f"http://{scrapyd_host}:{scrapyd_port}"
    
    def get_jobs_status(self):
        route = f"{self.scrapydUrl}/listjobs.json"
        
        response = requests.request(
            "GET", route, params={"project": self.scrapyd_projects}, auth=(self.scrapyd_username, self.scrapyd_password), headers = {'content-type': 'application/json'})
        
        json_data = response.json()
        
        return json_data

    def schedule_amazon_page_scrapy(self, asin):
        route = f"{self.scrapydUrl}/schedule.json"
        mp_encoder = MultipartEncoder(
            fields={
                "project": "default",
                "spider": "amazon_page",
                "asin": asin
            }
        )
        
        headers = {
            "Content-Type": mp_encoder.content_type
        }

        response = requests.request(
            "POST", route, data=mp_encoder, 
            headers=headers, auth=(self.scrapyd_username, self.scrapyd_password))
        
        json_data = response.json()
        
        return json_data