#!/usr/bin/env bash

python manage.py loaddata ../dumpData.json --ignorenonexistent --app unboxr
