#!/bin/sh

# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."
docker run --name insumos-db -d \
  -e MYSQL_ROOT_PASSWORD=123 \
  -e MYSQL_DATABASE=insumos -e MYSQL_USER=user_service -e MYSQL_PASSWORD=1234 \
  -p 3306:3306 \
  mysql:latest

# Wait for the database service to start up.
echo "Waiting for DB to start up..."
docker exec insumos-db mysqladmin --silent --wait=30 -uuser_service -p1234 ping || exit 1

# Fucking pre-setup
echo "Setting up initial user..."
docker exec -i insumos-db mysql -uroot -p123 insumos -e "GRANT ALL PRIVILEGES ON insumos.* TO '${MYSQL_USER}'@'%' WITH GRANT OPTION"

# Run the setup script.
echo "Setting up initial data..."
docker exec -i insumos-db mysql -uuser_service -p1234 insumos < setup.sql
