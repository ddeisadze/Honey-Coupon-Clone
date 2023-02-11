from rest_framework import serializers
from unboxr.models import Product, Promotion, Influencer, InfluencerSocialMedia, Coupon, ProductPrice


social_choices = (
    ('Tik', 'Tik Tok'),
    ('Insta', 'Instagram'),
    ('Fb', 'Facebook'),
    ('Yt', 'Youtube')
)


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
        fields = '__all__'
        depth = 1


class ProductSerializer(serializers.ModelSerializer):
    prices = ProductPriceSerializer(many=True, read_only=True, source='prices')

    class Meta:
        model = Product
        fields = ['product_name', 'company_name', 'company_website', 'product_price', 'merchant_product_page',
                  'product_description', 'product_images', 'product_ids', 'product_categories', 'prices']
        depth = 1


class PromotionSerializer(serializers.ModelSerializer):
    influencer = InfluencerSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    # coupon = CouponSerializer(read_only=True)
    coupons = CouponSerializer(many=True, read_only=True, source='coupon')

    # videos = serializers.SerializerMethodField()
    # images = serializers.SerializerMethodField()

    class Meta:
        model = Promotion
        fields = ['influencer', 'product', 'videos', 'images', 'social_media_type', 'coupon_description', 'coupon_code_in_the_link',
                  'post_link', 'post_promotion_date', 'promotion_expiration_date', 'advertisement_link', 'date_modified', 'coupons']
        depth = 1
