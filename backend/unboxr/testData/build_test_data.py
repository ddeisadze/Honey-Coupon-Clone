# from django.contrib.auth.models import User
from unboxr.models import Product_Category, ProductImages, Product, ProductPrice, InfluencerSocialMedia, ProductSkuId, ProductIdType, Influencer


def populate_test_data():
    # Create test product categories
    product_category_1 = Product_Category.objects.create(
        name='Fashion',
        description='Clothing, shoes and accessories'
    )
    electronics_category = Product_Category.objects.create(
        name='Electronics',
        description='Gadgets and appliances'
    )

    # Create a test product
    product = Product.objects.create(
        company_name='Nebula',
        company_website='https://us.seenebula.com/products/d2426-capsule-3-laser',
        product_name='Capsule 3 Laser',
        product_description='Nebula Anker Capsule 3 Laser 1080p, Smart, Wi-Fi, Mini Projector, Black, Portable Projector, Dolby Digital, Laser Projector, Autofocus, 120-Inch Picture, Built-in Battery, 2.5 Hours of Playtime',
        merchant_product_page='https://www.amazon.com/gp/product/B0BCWNQPQ7/ref=ox_sc_saved_image_7?smid=A294P4X9EWVXLJ&psc=1'
    )

    # Add product categories to the product
    product.product_categories.add(electronics_category)

    product_price = ProductPrice.objects.create(
        product=product,
        source='https://www.amazon.com/gp/product/B0BCWNQPQ7/ref=ox_sc_saved_image_7?smid=A294P4X9EWVXLJ&psc=1',
        total_price='799.99'
    )

    # Populate the ProductIdType model
    product_id_types = [{"name": "ASIN", "description": "Amazon Standard Identification Number"},    {"name": "UPC", "description": "Universal Product Code"},    {
        "name": "EAN", "description": "European Article Number"},    {"name": "ISBN", "description": "International Standard Book Number"}]

    for product_id_type in product_id_types:
        ProductIdType.objects.create(**product_id_type)

    product_sku_id = ProductSkuId.objects.create(
        product=product,
        product_id_value='B0BCWNQPQ7',
        product_id_type=ProductIdType.objects.filter(name="ASIN")
    )

    influencer = Influencer.objects.create(
        name="Dan Driggs",
        description="Tech Influencer"
    )

    # Create test data for InfluencerSocialMedia
    influencer_sm_1 = InfluencerSocialMedia.objects.create(
        influencer=influencer, social_media_type="Tik", social_media_username="driggsy")

    # Populate the Product_Category model
    product_categories = [
        {"name": "Electronics", "description": "Electronics and gadgets"},
        {"name": "Fashion", "description": "Clothing and accessories"},
        {"name": "Home & Kitchen", "description": "Home appliances and kitchen utensils"},
        {"name": "Sports & Outdoors", "description": "Sports equipment and outdoor gear"}
    ]
    for product_category in product_categories:
        Product_Category.objects.create(**product_category)