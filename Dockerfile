FROM node:16
WORKDIR /vocabulary-facade-api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]