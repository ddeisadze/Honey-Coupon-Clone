#!/usr/bin/env bash
# exit on error
cd backend
set -o errexit

poetry lock --no-update
poetry install

python manage.py collectstatic --no-input
python manage.py migrate
