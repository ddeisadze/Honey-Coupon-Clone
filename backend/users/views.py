from django.shortcuts import render

# Create your views here.
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://127.0.0.1:8000/accounts/google/login/callback/"
    client_class = OAuth2Client


# https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://127.0.0.1:8000/accounts/google/login/callback/&prompt=consent&response_type=code&client_id=175988724842-m3spm4c7oc4thvqkcrota39rt8f9fk54.apps.googleusercontent.com&scope=openid%20email%20profile&access_type=offline

# http://127.0.0.1:8000/accounts/google/login/callback/
# ?code=4%2F0AWtgzh5IdIyNvejlALV7aG39mvE-xFUirwbRvVfQgOjfYWYmITjQnh-ppvZclT0kdqIUZw
# &scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&authuser=0&prompt=consent