# Automatically created by: scrapyd-deploy

from setuptools import setup, find_packages

setup(
    name='unboxr.scraper',
    version='1.0',
    packages=find_packages(),
    entry_points={'scrapy': ['settings = products.settings']},
)
