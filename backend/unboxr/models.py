from django.db import models
from datetime import datetime

social_choices = (
        ('Tik', 'Tik Tok'),
        ('Insta', 'Instagram'),
        ('Fb', 'Facebook'),
        ('Yt', 'Youtube')
    )

class Product_Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name

class ProductImages(models.Model):
    image = models.ImageField(upload_to='product_images')
    product = models.ForeignKey("Product", related_name='images', on_delete=models.CASCADE, blank=True)

class Product(models.Model):
    company_name = models.CharField(max_length=255,default="n/a")
    company_website = models.URLField(default="n/a")

    product_name = models.CharField(max_length=255)
    # product_sku = models.CharField(max_length=255, blank=True)
    # product_other_id = models.CharField(max_length=255, blank=True)
    product_categories = models.ManyToManyField(Product_Category, related_name='products')
    
    product_description = models.TextField(blank=True)
    
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_page = models.URLField()

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.product_name + " - " + self.company_name + " - "

class InfluencerSocialMedia(models.Model):
    influencer = models.ForeignKey("Influencer", related_name='social_media', on_delete=models.CASCADE)
    social_media_type = models.CharField(max_length=255, choices = social_choices, default="na")
    social_media_username = models.CharField(max_length=255)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

class ProductSkuId(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_id_type = models.ManyToManyField("ProductIdType", related_name='product_id_type')
    product_id_value = models.CharField(max_length=255)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

class ProductIdType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name

class Influencer(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name

class Promotion(models.Model):
    influencer = models.ForeignKey(Influencer, on_delete=models.CASCADE)
    social_media_type = models.CharField(max_length=255, choices = social_choices, default="na")

    coupon_code = models.CharField(max_length=255, blank=True, null=True)
    coupon_description = models.TextField(blank=True, null=True)
    # coupon_website_link = models.URLField()

    post_link = models.URLField()

    post_promotion_date = models.DateTimeField(default=datetime.now())
    promotion_expiration_date = models.DateTimeField(blank=True, null=True)

    advertisement_link = models.URLField(blank=True, null=True)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)
 
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.influencer.name + " - " + self.social_media_type + " - " + (self.product.product_name if self.product != None else "n/a")

class Video(models.Model):
    url = models.URLField()
    unboxing = models.ForeignKey("Promotion", related_name='videos', on_delete=models.CASCADE)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

class Image(models.Model):
    image = models.ImageField(upload_to='Promotion_images')
    unboxing = models.ForeignKey("Promotion", related_name='images', on_delete=models.CASCADE)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)


# class Unboxing(models.Model):
#     product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='unboxings')
#     promotions = models.ManyToManyField(Promotion, related_name='unboxings')

#     date_modified = models.DateTimeField(auto_now=True)
#     date_published = models.DateTimeField(auto_now_add=True)