# syntax=docker/dockerfile:1
#Db from products

FROM postgres

USER postgres

COPY ./products_db-init.sql /docker-entrypoint-initdb.d/db_script.sql
COPY ./db-password.txt /run/secrets/db-password

ENV POSTGRES_DB=dan_products_db
ENV POSTGRES_PASSWORD_FILE=/run/secrets/db-password

VOLUME /var/lib/postgresql/data

EXPOSE 5432

