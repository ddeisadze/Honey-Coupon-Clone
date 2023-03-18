from django.urls import include, path

from . import views

urlpatterns = [
    path('rest-auth/', include('dj_rest_auth.urls')),    
    path('rest-auth/register/', include('dj_rest_auth.registration.urls')),
    path('rest-auth/google/', views.GoogleLogin.as_view(), name='google_login'),

]