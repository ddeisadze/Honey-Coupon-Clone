from celery import shared_task
from celery.schedules import crontab
from backend.celery import app as celery_app
from django.db import transaction
from django.utils import timezone

from api.scrapyd import ScrapydDjango
from db.mongo import MongoDbDjango
from . import models

import time
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

mongo = MongoDbDjango()
scrapyd = ScrapydDjango()

@shared_task
def get_new_price_for_product_on_amazon():
    # get all active products
    active_products = models.Product.objects.filter(is_active=True)
    
    failed = []
    success_job_ids_asin : list[(str, str)] = [] 
    
    for productModel in active_products:
        # scrape for prices
        asin = productModel.product_ids.get(product_id_type__name="asin").product_id_value
        resp = scrapyd.schedule_amazon_page_scrapy(asin)
        
        resp_status = resp.get("status", None)
        
        if(resp_status == "ok"):
            success_job_ids_asin.append(
                (resp.get("jobid"), asin, productModel)
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
        for (jobid, asin, productModel) in success_job_ids_asin:
            if not jobid in finished:
                pending_check.append(jobid)
        
        if len(pending_check) > 0:
            should_we_poll_again = True
            time.sleep(1)
        else:
            should_we_poll_again = False
    
    # add new price record to products
    for (jobid, asin, productModel) in success_job_ids_asin:
        mongo_scraped_object = mongo.get_items_from_crawler(asin=asin, job_id=jobid)
        
        if mongo_scraped_object:
            price_to_pay = mongo_scraped_object.get("crawledData", None).get("PricePaid", None)
            list_price = mongo_scraped_object.get("crawledData", None).get("PriceList", None)
            
            discounted_price_clean = float(price_to_pay.strip("$"))
            list_price_clean = float((list_price if list_price else price_to_pay).strip("$"))
            
            models.ProductPrice(discounted_price=discounted_price_clean, list_price=list_price_clean, product = productModel, source="http://amazon.com").save()
            
            check_if_coupon_was_added(mongo_scraped_object, productModel)

# @shared_task
def on_coupon_detection_send_alert_to_subscribed_users(productModel : models.Product, coupon_object):
    get_all_users_to_email = models.ProductEmailAlert.objects.filter(
        product = productModel,
        active = True,
        alert_type = models.AlertTypes.COUPON
    )
    
    alert_subscriber : models.ProductEmailAlert
    
    for alert_subscriber in get_all_users_to_email:
        email = alert_subscriber.email
        
        discount_value = float(coupon_object.get("discount_value"))
        
        time_delta_since_last_email = timezone.now() - (alert_subscriber.email_last_sent if alert_subscriber.email_last_sent else timezone.now())
        
        if alert_subscriber.email_last_sent:
            html_body = render_to_string("amazon_coupon_email.html", context={
                "product" : productModel,
                "coupon_off" : '${:,.2f}'.format(discount_value),
                "new_price" : (float(productModel.current_price()) - discount_value),
                "product_image_url" : productModel.product_images.first().image_url if productModel.product_images.first() else ""
            })
            
            message = EmailMultiAlternatives(
                subject=f'New Coupon for {productModel.product_name}',
                from_email='ddeisadze7@gmail.com',
                to=['ddeisadze7@gmail.com', 'tbilisimax@gmail.com', ]
            )
            
            message.attach_alternative(html_body, "text/html")
            message.send(fail_silently=False)

            # send_mail(
            # f'New Coupon for {productModel.product_name}',
            # f'Go to amazon now, you will save ${discount_value}. Total price will be ${float(productModel.current_price()) - discount_value}. Here is the product link {productModel.merchant_product_page}',
            # 'ddeisadze7@gmail.com',
            # [email],
            # fail_silently=False)
            alert_subscriber.email_last_sent = timezone.now()
        else:
            print("not sending")
    
def check_if_coupon_was_added(mongo_scraped_object, productModel):
    coupon_data_record = mongo_scraped_object.get("crawledData", None).get("Coupons", None)
    
    coupon_object  = coupon_data_record.get("first_one") if coupon_data_record else None
    
    if coupon_object:
        # notify any users that have been subscribed to that product about the coupons alert
        on_coupon_detection_send_alert_to_subscribed_users(productModel, coupon_object)
    
    return False