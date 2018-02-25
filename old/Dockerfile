FROM node:6.9.2
EXPOSE 3022
COPY package.json .
COPY microsvinsumos.js .
RUN npm install

FROM mysql:5
ADD . setup.sql
ENV MYSQL_PWD 123
RUN apt-get -y install mysql-server
RUN echo "mysql-server mysql-server/root_password password $MYSQL_PWD" | debconf-set-selections
RUN echo "mysql-server mysql-server/root_password_again password $MYSQL_PWD" | debconf-set-selections
ADD run.sh /run.sh

CMD node microsvinsumos.js