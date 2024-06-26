from rest_framework import serializers
from unboxr.models import Product, Promotion, Influencer, InfluencerSocialMedia, Coupon, ProductPrice, ProductIdValue, ProductEmailAlert, social_choices, AlertTypes
from rest_framework import exceptions
from rest_framework.fields import CurrentUserDefault


class InfluencerSocialMediaSerializer(serializers.ModelSerializer):
    platform = serializers.ChoiceField(
        choices=social_choices, source='social_media_type')
    username = serializers.CharField(source='social_media_username')

    class Meta:
        model = InfluencerSocialMedia
        fields = ['platform', 'username']


class InfluencerSerializer(serializers.ModelSerializer):
    social_medias = InfluencerSocialMediaSerializer(
        many=True, read_only=True, source='social_media')

    class Meta:
        model = Influencer
        fields = ['name', 'description', 'social_medias']
        depth = 2


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['coupon_code']
        depth = 1


class ProductPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPrice
        exclude = ('product',)
        depth = 1

class ProductIdValuesSerializer(serializers.ModelSerializer):
    product_id_type = serializers.CharField(source='product_id_type.name')
    
    class Meta:
        model = ProductIdValue
        fields = ("product_id_value", "product_id_type")

class ProductSerializer(serializers.ModelSerializer):
    prices = ProductPriceSerializer(many=True, read_only=True)
    product_ids = ProductIdValuesSerializer(many = True)

    class Meta:
        model = Product
        fields = ['product_name', 'company_name', 'company_website', 'merchant_product_page',
                  'product_description', 'product_images', 'product_ids', 'product_categories', 'prices', 'is_active']
        depth = 1


class PromotionSerializer(serializers.ModelSerializer):
    influencer = InfluencerSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    coupons = CouponSerializer(many=True, read_only=True, source='coupon')

    class Meta:
        model = Promotion
        fields = ['influencer', 'product', 'videos', 'images', 'social_media_type', 'coupon_description', 'coupon_code_in_the_link',
                  'post_link', 'post_promotion_date', 'promotion_expiration_date', 'advertisement_link', 'date_modified', 'coupons']
        depth = 1

class ProductEmailAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductEmailAlert
        fields = '__all__'

class ProductEmailAlertCreateSerializer(serializers.Serializer):
    alert_type = serializers.ChoiceField(
    choices=AlertTypes.choices)    
    product = ProductIdValuesSerializer()

    def create(self, validated_data):
        product = validated_data.get('product')
        product_id_value = product.get('product_id_value')
        product_id_type_name = product.get('product_id_type').get('name')
        
        product_id = ProductIdValue.objects.filter(
            product_id_type__name=product_id_type_name,
            product_id_value=product_id_value).first()
        
        if not product_id:
            raise exceptions.NotFound("Id not found")
        
        product = product_id.product
        
        new_alert = ProductEmailAlert(
            product=product,
            alert_type = validated_data.get("alert_type"),
            owner = self.context.get("request").user
        )
        
        new_alert.save()
        
        return {
            "alert_type" : new_alert.alert_type,
            "product" : product_id
                }