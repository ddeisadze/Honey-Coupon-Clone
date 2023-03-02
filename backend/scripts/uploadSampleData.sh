#!/usr/bin/env bash

python manage.py loaddata dumpdata.json --ignorenonexistent --app unboxr
