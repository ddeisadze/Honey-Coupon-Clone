from backend.settings.common import *

CORS_ALLOW_ALL_ORIGINS = True
ENVIRONMENT = "DEV"

INSTALLED_APPS.append('django_extensions')

# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
MJML_TCPSERVERS = [
    ('localhost', 28102),
]