from celery import shared_task
from celery.schedules import crontab
from backend.celery import app as celery_app
from django.db import transaction

from api.scrapyd import ScrapydDjango
from db.mongo import MongoDbDjango
from . import models

import time

mongo = MongoDbDjango()
scrapyd = ScrapydDjango()

def commited(*args, **kwargs):
    print("Commited", args, kwargs)

@shared_task
def get_new_price_for_product_on_amazon():
    # get all active products
    active_products = models.Product.objects.filter(is_active=True)
    
    failed = []
    success_job_ids_asin : list[(str, str)] = [] 
    
    for product in active_products:
        # scrape for prices
        asin = product.product_ids.get(product_id_type__name="asin").product_id_value
        resp = scrapyd.schedule_amazon_page_scrapy(asin)
        
        resp_status = resp.get("status", None)
        
        if(resp_status == "ok"):
            success_job_ids_asin.append(
                (resp.get("jobid"), asin, product)
            )
        else:
            failed.append(resp)
            continue
    
    if len(active_products) < 0:
        print("No active products")
        return 
    
    # check if jobs are complete
    should_we_poll_again = True
    while should_we_poll_again:
        status = scrapyd.get_jobs_status()
        # running = [i["id"] for i in status.get("running", [])]
        # pending = [i["id"] for i in status.get("pending", [])]
        finished = [i["id"] for i in status.get("finished", [])]
        
        pending_check = []
        for (jobid, asin, product) in success_job_ids_asin:
            if not jobid in finished:
                pending_check.append(jobid)
        
        if len(pending_check) > 0:
            should_we_poll_again = True
            time.sleep(1)
        else:
            should_we_poll_again = False
    
    # add new price record to products
    for (jobid, asin, product) in success_job_ids_asin:
        item = mongo.get_items_from_crawler(asin=asin, job_id=jobid)
        
        if item:
            price_to_pay = item.get("crawledData", None).get("PricePaid", None)
            list_price = item.get("crawledData", None).get("PriceList", None)
            
            discounted_price_clean = float(price_to_pay.strip("$"))
            list_price_clean = float((list_price if list_price else price_to_pay).strip("$"))
            
            # with transaction.atomic():
            models.ProductPrice(discounted_price=discounted_price_clean, list_price=list_price_clean, product = product, source="http://amazon.com").save()
                
                # transaction.commit()
                
                # transaction.on_commit(commited)

# @celery_app.on_after_finalize.connect
# def setup_periodic_tasks(sender, **kwargs):
#     sender.add_periodic_task(
#         crontab(hour=22, minute=59, day_of_week=0),
#         get_new_price_for_product_on_amazon
#     )