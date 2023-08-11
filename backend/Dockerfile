FROM node:18

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install

COPY . .

# Install MySQL client
RUN apt update \
  && apt install -y default-mysql-client
RUN cp client_mysql_conf/client.cnf /etc/mysql/conf.d/client.cnf

EXPOSE 8080
CMD ["npm", "start"]