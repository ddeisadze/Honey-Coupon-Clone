# Create your views here.
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status, permissions, serializers, viewsets 
from django.http import JsonResponse
from rest_framework.decorators import action
from drf_yasg import openapi

from .models import ProductIdValue, Promotion, Coupon, Product
from .serializers.serializers import PromotionSerializer, CouponSerializer, ProductSerializer
from requests_toolbelt.multipart.encoder import MultipartEncoder
from django import http


import requests

from drf_yasg.utils import swagger_auto_schema


class SearchRequestForm(serializers.Serializer):
    product_id_type = serializers.CharField(default='asin')
    product_id_value = serializers.CharField()
    product_name = serializers.CharField()
    company_website = serializers.CharField()
    company_name = serializers.CharField()
    product_price = serializers.CharField()
    product_page = serializers.CharField()
    product_description = serializers.CharField()




# this view is a generic search that find the product based on
class FindInfluencerVideoByProductInfo(APIView):
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=SearchRequestForm, responses={
        "200" : PromotionSerializer
    })
    def post(self, request):
        serializer = SearchRequestForm(data=request.data)

        serializer.is_valid(raise_exception=False)

        # try to find product by sku
        product_sku_ids = ProductIdValue.objects.filter(
            product_id_type__name=serializer.data['product_id_type'],
            product_id_value=serializer.data['product_id_value']
        )

        if product_sku_ids:
            product = product_sku_ids[0].product

            # CHECK IF WE HAVE RECORD OF PRICE AND UPDATE IF THE PRICE OF PRODUCT HAS CHANGED
            try:
                new_price = float(serializer.data['product_price']) if "$" not in serializer.data['product_price'] else float(
                    serializer.data['product_price'][1:])
                new_price = 850.99
                if float(product.product_price) != new_price:
                    print("yes", new_price, float(product.product_price))
                    price_instance = ProductPrice.objects.create(
                        price=new_price, product=product)
                else:
                    print("no", new_price, product.product_price,
                          serializer.data['product_price']) 
            except:
                print("cant find current price of product")

            get_all_prom = Promotion.objects.filter(product=product)

            serialized_promos_arr = []
            for promo in get_all_prom:
                serialized_promos_arr.append(PromotionSerializer(promo).data)

            return JsonResponse(serialized_promos_arr, safe=False)

        # IF NO PROMOTIONS FOUND WE WILL SEND OVER THE PRODUCT INFO TO SCRAPYD TO SCRAPE THE PRODUCT PAGE
        try:
            # print(serializer.data)
            if serializer.data['product_page']:
                crawl_amazon_product_pages = CrawlAmazonProductPages()
                crawl_amazon_product_pages.post(request)
        except:
            pass

        return HttpResponse('No promotions found', status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema()
class CrawlAmazonProductPages(APIView):
    permission_classes = (permissions.AllowAny,)

    @swagger_auto_schema(request_body=SearchRequestForm)
    def post(self, request):
        serializer = SearchRequestForm(data=request.data)
        serializer.is_valid(raise_exception=False)
        scrapydUrl = "http://192.168.1.160:6800/schedule.json"

        asin = serializer.data["product_id_value"]

        mp_encoder = MultipartEncoder(
            fields={
                "project": "default",
                "spider": "amazon_page",
                "asin": asin,
            }
        )
        headers = {
            "Content-Type": mp_encoder.content_type
        }

        response = requests.request(
            "POST", scrapydUrl, data=mp_encoder, headers=headers, auth=('scrapy', 'secret'))

        return response.text

@swagger_auto_schema()
class ProductsViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    @action(detail=False, methods=["get"], url_path="by/asin/(?P<asin>[^/.]+)")
    def by_asin(self, request, asin):
        if not asin or asin is "":
            return http.HttpResponseBadRequest("Asin was invalid.")
        
        product_id_search = ProductIdValue.objects.filter(
            product_id_type__name="asin",
            product_id_value=asin
        )
        
        if product_id_search:
            product = product_id_search[0].product
            return JsonResponse(ProductSerializer(product).data, safe=False)