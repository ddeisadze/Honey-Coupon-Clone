# Create your views here.
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status, permissions, serializers
from django.http import JsonResponse

from .models import ProductSkuId, Promotion, Coupon
from .serializers.serializers import PromotionSerializer, CouponSerializer

import requests

from drf_yasg.utils import swagger_auto_schema


class FindInfluencerForm(serializers.Serializer):
    product_id_type = serializers.CharField(default='asin')
    product_id_value = serializers.CharField()
    product_name = serializers.CharField()
    company_website = serializers.CharField()
    company_name = serializers.CharField()
    product_price = serializers.CharField()
    product_page = serializers.CharField()
    product_description = serializers.CharField()

#this view is a generic search that find the product based on
class FindInfluencerVideoByProductInfo(APIView):
    permission_classes = (permissions.AllowAny,)
    @swagger_auto_schema(request_body=FindInfluencerForm)
    def post(self, request):
        # <view logic>
        print(request.data)
        serializer = FindInfluencerForm(data=request.data)

        serializer.is_valid(raise_exception=False)

        # try to find prodyct by sku

        product_sku_ids = ProductSkuId.objects.filter(
            product_id_type__name=serializer.data['product_id_type'],
            product_id_value=serializer.data['product_id_value']
        )

        if product_sku_ids:
            product = product_sku_ids[0].product

            promotions = Promotion.objects.filter(product=product)


            if len(promotions) < 1:
                return HttpResponse('No promotions found', status=status.HTTP_404_NOT_FOUND)

            get_first_prom = promotions[0]
            get_all_prom = promotions # there should be only for now 
            # print(get_all_prom)
            # print(Coupon.objects.filter(promotion=get_first_prom))
            # print(PromotionSerializer(get_first_prom).data)

            serialized_promos_arr = []
            # crawl_amazon_product_pages = CrawlAmazonProductPages()
            # crawl_amazon_product_pages.post(request)
            for promo in get_all_prom:
                serialized_promos_arr.append(PromotionSerializer(promo).data)


            return JsonResponse(serialized_promos_arr, safe=False) 
        try:
            print(serializer.data)
            if serializer.data['product_page']:
                print('ayo')
                crawl_amazon_product_pages = CrawlAmazonProductPages()
                crawl_amazon_product_pages.post()
        except:
            pass
        print('ayo2')

        return HttpResponse('No promotions found', status=status.HTTP_404_NOT_FOUND)


    
 
class CrawlAmazonProductPages(APIView):
    permission_classes = (permissions.AllowAny,)
    @swagger_auto_schema(request_body=FindInfluencerForm)
    def post(self, request):
        print("heyy")
        serializer = FindInfluencerForm(data=request.data)
        serializer.is_valid(raise_exception=False)
        # url = serializer.data['product_page']
        url = "http://192.168.1.160:5000/schedule.json"

        payload = {
            "project": "product",
            "spider": "amazon_page",
            "asin": "B0BCWNQPQ7"
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic c2NyYXB5OnNlY3JldA=="
        }

        response = requests.request("POST", url, json=payload, headers=headers)

        print(response.text)

        #TODO: send url to scrapy crawler and crawl the uncrawled product page

        # scrapyd_host = 'http://localhost'
        # scrapyd_port = 8000
        # spider_name = 'my_spider'
        # params = {'project': 'my_project', 'spider': spider_name, 'url': url}
        # response = requests.post(f'{scrapyd_host}:{scrapyd_port}/schedule.json', data=params)
        return JsonResponse({"url":"url"})


