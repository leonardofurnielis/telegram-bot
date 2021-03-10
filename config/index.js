/* eslint-disable global-require */

'use strict';

const http = require('http');

const EnvironmentLoader = require('./environment');
const LogLoader = require('./log');
const HttpLoader = require('./http');
const RoutesLoader = require('./routes');
const BootstrapLoader = require('./bootstrap');

module.exports = {
  create: async (app) => {
    EnvironmentLoader();

    LogLoader();

    HttpLoader(app);

    RoutesLoader(app);

    BootstrapLoader();
  },
  listen: async (app) => {
    console.info(`Port: ${process.env.PORT || 3000}`);
    console.info(`NODE_ENV: ${process.env.NODE_ENV || 'local'}`);
    console.info(`Logger Level: ${process.env.LOGGER_LEVEL}`);

    const server = http.createServer(app);

    server.on('clientError', (err) => {
      console.error(err);
    });

    server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
      console.info(
        `REST server running on: http://${server.address().address}:${process.env.PORT || 3000}`
      );

      // console.info(
      //   `OpenAPI-UI is running on: http://${server.address().address}:${
      //     process.env.PORT || 3000
      //   }/explorer`
      // );
      console.info('To shut down, press <CTRL> + C at any time.');
    });
  },
};
