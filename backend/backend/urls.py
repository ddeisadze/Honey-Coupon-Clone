"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.urls import include, re_path

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from unboxr.views import FindInfluencerVideoByProductInfo, CrawlAmazonProductPages, ProductsViewSet, ProductEmailAlertViewSet

schema_view = get_schema_view(
   openapi.Info(
      title="Unboxr API",
      default_version='v1',
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'products', ProductsViewSet)
router.register(r'products-alerts', ProductEmailAlertViewSet, basename="products-alerts")

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/unboxr/', include(router.urls)),
 
    path('promotions/get/', FindInfluencerVideoByProductInfo.as_view(), name="send-influencer-info"),
    path('products/crawl', CrawlAmazonProductPages.as_view(), name='crawl-amazon-product-pages' ), 
    
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    path('', include('users.urls')),
    
    path('accounts/', include('allauth.urls')),
 
]
