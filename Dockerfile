FROM node:16
WORKDIR /vocabulary-facade-api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]