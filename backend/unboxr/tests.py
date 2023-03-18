from unboxr import models
from unboxr import tasks
import pytest


# Create your tests here.
@pytest.fixture
def product() -> models.Product:
    product_category_1 = models.Product_Category.objects.create(
            name='Fashion',
            description='Clothing, shoes and accessories'
        )
    
    electronics_category =  models.Product_Category.objects.create(
        name='Electronics',
        description='Gadgets and appliances'
    )

    # Create a test product
    product =  models.Product.objects.create(
        company_name='Nebula',
        company_website='https://us.seenebula.com/products/d2426-capsule-3-laser',
        product_name='Capsule 3 Laser',
        product_description='Nebula Anker Capsule 3 Laser 1080p, Smart, Wi-Fi, Mini Projector, Black, Portable Projector, Dolby Digital, Laser Projector, Autofocus, 120-Inch Picture, Built-in Battery, 2.5 Hours of Playtime',
        merchant_product_page='https://www.amazon.com/gp/product/B0BCWNQPQ7/ref=ox_sc_saved_image_7?smid=A294P4X9EWVXLJ&psc=1'
    )

    # Add product categories to the product
    product.product_categories.add(electronics_category)

    models.ProductPrice.objects.create(
        product=product,
        source='https://www.amazon.com/gp/product/B0BCWNQPQ7/ref=ox_sc_saved_image_7?smid=A294P4X9EWVXLJ&psc=1',
        list_price=799.99,
        discounted_price=799.99
    )
    
    # Populate the ProductIdType model
    product_id_types = [{"name": "ASIN", "description": "Amazon Standard Identification Number"},    {"name": "UPC", "description": "Universal Product Code"},    {
        "name": "EAN", "description": "European Article Number"},    {"name": "ISBN", "description": "International Standard Book Number"}]

    for product_id_type in product_id_types:
         models.ProductIdType.objects.create(**product_id_type)

    product_sku_id =  models.ProductIdValue.objects.create(
        product=product,
        product_id_value='B0BCWNQPQ7'
    )
    
    return product

@pytest.fixture
def subscriber(product):
    return models.ProductEmailAlert.objects.create(
        product = product,
        email = "ddeisadze7@gmail.com",
        active = True,
        alert_type = models.AlertTypes.COUPON
    )

@pytest.mark.django_db
class TestExample:
    def test_send_email(product, subscriber):
        tasks.on_coupon_detection_send_alert_to_subscribed_users(
            product,
            {
                "discountValue" : "80"
            }
        )
        # assert product == 2