Build instructiosn for render from https://render.com/docs/deploy-django#update-your-app-for-render

How to run jupyter notebook with Django context:
    poetry run python manage.py shell_plus --notebook

    Start notebook with these imports,
        import os
        import django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rest.settings')
        os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
        django.setup()