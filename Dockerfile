FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:1

WORKDIR /opt/app-root/src

COPY package.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
