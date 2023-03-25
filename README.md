Change Git Branch on Oracle server:
    1. cd unboxr
    2. git fetch
    3. git checkout :to branch we want to run on server
    4. sudo docker compose down
    5. sudo docker compose up -d --build
    6. sudo docker ps :lists out all running containers and get backend container id
    7. sudo docker exec -it 03c340f3aca3(id) bash
    8. python manage.py makemigrations
    9. python manage.py migrate

