from django.shortcuts import render
from django.core import serializers as core_serializers

# Create your views here.
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status, permissions, serializers

from .models import Product, ProductSkuId, Promotion

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class FindInfluencerForm(serializers.Serializer):
    product_id_type = serializers.CharField()
    product_id_value = serializers.CharField()
    product_name = serializers.CharField()
    company_website = serializers.CharField()
    company_name = serializers.CharField()
    product_price = serializers.CharField()
    product_page = serializers.CharField()
    product_description = serializers.CharField()

class FindInfluencerVideoByProductInfo(APIView):
    permission_classes = (permissions.AllowAny,)
    @swagger_auto_schema(request_body=FindInfluencerForm)
    def post(self, request):
        # <view logic>

        serializer = FindInfluencerForm(data=request.data)

        serializer.is_valid(raise_exception=False)

        product_id_type = "ASIN"

        print(serializer.data)

        # try to find prodyct by sku

        product_sku_ids = ProductSkuId.objects.filter(
            product_id_type__name=serializer.data['product_id_type'],
            product_id_value=serializer.data['product_id_value']
        )

        if product_sku_ids:
            product = product_sku_ids[0].product

            promotions = Promotion.objects.filter(product=product)

            qs_json = core_serializers.serialize('json', promotions)
            return HttpResponse(qs_json, content_type='application/json')

        return HttpResponse('result')