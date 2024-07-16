# syntax=docker/dockerfile:1
#Db from products

FROM mysql

COPY ./users_db-init.sql /docker-entrypoint-initdb.d/db_script.sql
COPY ./db-password.txt /run/secrets/db-password

ENV MYSQL_DATABASE=dan_users_db
ENV MYSQL_ROOT_PASSWORD_FILE=/run/secrets/db-password

VOLUME /var/lib/mysql

EXPOSE 3306

