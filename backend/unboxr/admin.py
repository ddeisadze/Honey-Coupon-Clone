from django.contrib import admin
from .models import * 

from django.contrib import admin

class VideoInline(admin.TabularInline):
    model = Video

class ImageInline(admin.TabularInline):
    model = Image

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    model = Coupon

class CouponInline(admin.TabularInline):
    model = Coupon

class InfluencerSocialMediaInline(admin.TabularInline):
    model = InfluencerSocialMedia


@admin.register(Influencer)
class InfluencerAdmin(admin.ModelAdmin):
    inlines = [
        InfluencerSocialMediaInline,
    ]

    # filter_vertical = ('promotions',)

class InfluencerInline(admin.TabularInline):
    model = Influencer
    extra = 1

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    inlines = [
        VideoInline,
        ImageInline, 
        CouponInline
    ]

class PromotionalInline(admin.TabularInline):
    model = Promotion
    extra = 1

@admin.register(ProductIdType)
class ProductIdType(admin.ModelAdmin):
    model = ProductIdType
    search_fields = ['name']

class ProductIdTypeInline(admin.TabularInline):
    model = ProductIdType

class ProductIdInline(admin.TabularInline):
    model = ProductSkuId
    extra = 1

    autocomplete_fields = ['product_id_type']

    # inlines = [ProductIdTypeInline]

@admin.register(Product)
class PromotionAdmin(admin.ModelAdmin):
    inlines = [
        PromotionalInline,
        ProductIdInline
    ]

    # filter_horizontal  = ('product_id_type',)

admin.site.register(Product_Category)