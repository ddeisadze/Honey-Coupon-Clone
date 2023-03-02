from django.db import models
from datetime import datetime
from django.conf import settings


social_choices = (
    ('Tik', 'Tik Tok'),
    ('Insta', 'Instagram'),
    ('Fb', 'Facebook'),
    ('Yt', 'Youtube')
)

class AlertTypes(models.TextChoices):
        COUPON = 'NCP', ('New Coupon')

class ProductEmailAlert(models.Model):
    product = models.ForeignKey("Product", on_delete=models.CASCADE, related_name='email_alert')
    active = models.BooleanField(default=True)
    
    class AlertTypes(models.TextChoices):
        COUPON = 'NCP', ('New Coupon')
    
    alert_type = models.TextField(max_length=3, choices=AlertTypes.choices)
    
    email_last_sent = models.DateTimeField(blank=True, null=True)
    
    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='email_alerts', on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('owner', 'alert_type', 'product')


class Product_Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.name


class ProductImages(models.Model):
    image = models.ImageField(upload_to='product_images', blank=True)
    image_url = models.URLField(blank=True)
    product = models.ForeignKey(
        "Product", related_name='product_images', on_delete=models.CASCADE, blank=True)


class Product(models.Model):
    # TODO: We want multiple sources for the product, since it can exist in many websites
    company_name = models.CharField(max_length=255, default="n/a")
    company_website = models.URLField(
        default="n/a", help_text="Website to the source company that manufactures the product.")

    product_name = models.CharField(max_length=255)
    product_categories = models.ManyToManyField(
        Product_Category, related_name='products')

    product_description = models.TextField(blank=True)

    merchant_product_page = models.URLField(
        help_text="Link to the product page on merchant websites.")

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)
    
    is_active = models.BooleanField(default=False, help_text="If set to true, product is live for public viewing.")

    def __str__(self) -> str:
        return self.product_name + " - " + self.company_name + " - "

    def current_price(self):
        latest_price = self.prices.order_by('-date_modified').first()
        
        return latest_price.discounted_price if latest_price.discounted_price else latest_price.list_price


class ProductPrice(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='prices')
    
    source = models.URLField(default="n/a", blank=True)
    
    list_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, default=0)

    date_modified = models.DateTimeField(auto_now=True)
    date_added = models.DateTimeField(auto_now_add=True)
    
    @property
    def calculate_discount(self):
        list_price = self.list_price
        discounted_price = self.list_price if not self.discounted_price else self.discounted_price
        
        discount_applied = list_price - discounted_price
        
        if discount_applied > 0:
            return discount_applied
        
        return 0
    
    def save(self, *args, **kwargs):
        self.discount = self.calculate_discount
        super(ProductPrice, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.product} - {self.list_price} - {self.source}"


class InfluencerSocialMedia(models.Model):
    influencer = models.ForeignKey(
        "Influencer", related_name='social_media', on_delete=models.CASCADE)
    social_media_type = models.CharField(
        max_length=255, choices=social_choices, default="na")
    social_media_username = models.CharField(max_length=255)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

    def to_json(self):
        return {
            'social_media_type': self.social_media_type,
            'social_media_username': self.social_media_username,
        }


class ProductIdValue(models.Model):
    product = models.ForeignKey(
        Product, related_name="product_ids", on_delete=models.CASCADE)
    
    product_id_type = models.ForeignKey(
        "ProductIdType", related_name='product_id_type', on_delete=models.CASCADE, default=1)
    
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
    social_media_type = models.CharField(
        max_length=255, choices=social_choices, default="na")

    coupon_description = models.TextField(blank=True, null=True)
    coupon_code_in_the_link = models.URLField(
        blank=True, null=True, help_text="This field will be populated if the coupon code is directly in the link")

    post_link = models.URLField()

    post_promotion_date = models.DateTimeField(default=datetime.now())
    promotion_expiration_date = models.DateTimeField(blank=True, null=True)

    advertisement_link = models.URLField(blank=True, null=True)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.influencer.name + " - " + self.social_media_type + " - " + (self.product.product_name if self.product != None else "n/a")


class Coupon(models.Model):
    coupon_code = models.CharField(max_length=255, blank=True, null=True)
    promotion = models.ForeignKey(
        "Promotion", related_name='coupon', on_delete=models.CASCADE)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.coupon_code + " - " + self.promotion.influencer.name


class Video(models.Model):
    url = models.URLField()
    promotion = models.ForeignKey(
        "Promotion", related_name='videos', on_delete=models.CASCADE)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)


class Image(models.Model):
    # for serialziing see this link https://stackoverflow.com/questions/35522768/django-serializer-imagefield-to-get-full-url
    image = models.ImageField(upload_to='Promotion_images')
    promotion = models.ForeignKey(
        "Promotion", related_name='images', on_delete=models.CASCADE)

    date_modified = models.DateTimeField(auto_now=True)
    date_published = models.DateTimeField(auto_now_add=True)
