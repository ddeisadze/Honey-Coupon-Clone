#!/usr/bin/env bash
# exit on error
cd backend
set -o errexit

pip install --upgrade pip

poetry install

python manage.py collectstatic --no-input
python manage.py migrate
