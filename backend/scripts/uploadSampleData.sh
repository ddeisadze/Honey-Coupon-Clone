#!/usr/bin/env bash

python manage.py loaddata ../export-02-20.json --ignorenonexistent --app unboxr
