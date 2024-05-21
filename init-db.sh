#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE USER order_service_user WITH PASSWORD 'order_service_pass';
    CREATE DATABASE order_service;
    GRANT ALL PRIVILEGES ON DATABASE order_service TO order_service_user;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "order_service" <<-EOSQL
    GRANT ALL PRIVILEGES ON SCHEMA public TO order_service_user;
EOSQL
