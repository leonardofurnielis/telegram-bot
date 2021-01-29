FROM node:14.15.1-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
