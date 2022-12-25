from backend.settings.common import *
import os
import dj_database_url

DEBUG = False

SECRET_KEY = os.environ.get('SECRET_KEY', default='your secret key')

# SECURITY WARNING: update this when you have the production host
ALLOWED_HOSTS = []

RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:    
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(        
        # Feel free to alter this value to suit your needs.        
        default='postgresql://postgres:postgres@localhost:5432/mysite',        
        conn_max_age=600    )}

MIDDLEWARE.extend([
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware'
])

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

# This setting tells Django at which URL static files are going to be served to the user.
# Here, they well be accessible at your-domain.onrender.com/static/...
STATIC_URL = '/static/'
# Following settings only make sense on production and may break development environments.
if not DEBUG:    # Tell Django to copy statics to the `staticfiles` directory
    # in your application directory on Render.
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    # Turn on WhiteNoise storage backend that takes care of compressing static files
    # and creating unique names for each version so they can safely be cached forever.
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'