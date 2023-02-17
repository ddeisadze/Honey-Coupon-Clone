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
    
@admin.register(ProductPrice)
class ProductPriceAdmin(admin.ModelAdmin):
    model = ProductPrice

class ProductPriceInline(admin.TabularInline):
    model = ProductPrice
    extra = 0

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
    extra = 0

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    inlines = [
        VideoInline,
        ImageInline, 
        CouponInline
    ]

class PromotionalInline(admin.TabularInline):
    model = Promotion
    extra = 0

@admin.register(ProductIdType)
class ProductIdType(admin.ModelAdmin):
    model = ProductIdType
    search_fields = ['name']

class ProductIdTypeInline(admin.TabularInline):
    model = ProductIdType

class ProductIdInline(admin.TabularInline):
    model = ProductIdValue
    extra = 0

    autocomplete_fields = ['product_id_type']

    # inlines = [ProductIdTypeInline]

@admin.register(Product)
class PromotionAdmin(admin.ModelAdmin):
    inlines = [
        PromotionalInline,
        ProductIdInline, 
        ProductPriceInline
    ]

    # filter_horizontal  = ('product_id_type',)

admin.site.register(Product_Category)