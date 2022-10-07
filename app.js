'use strict';

const http = require('http');

const app = require('./config');

console.info(`Port: ${process.env.PORT || 3000}`);
console.info(`NODE_ENV: ${process.env.NODE_ENV || 'local'}`);
console.info(`Logger Level: ${process.env.LOGGER_LEVEL}`);

const server = http.createServer(app);

server.on('onError', (err) => {
  throw err;
});

server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
  console.info(
    `REST server running on: http://${server.address().address}:${process.env.PORT || 3000}`
  );

  // console.info(
  //   `OpenAPI-UI is running on: http://${server.address().address}:${
  //     process.env.PORT || 3000
  //   }/docs`
  // );
  console.info('To shut down, press <CTRL> + C at any time.');
});
