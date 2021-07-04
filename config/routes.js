/* eslint-disable global-require */

'use strict';

const path = require('path');
const errorHandler = require('node-error-handler');

const readRecursiveDirectory = require('../lib/read-recursive-directory');

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('swagger.json');

const routesLoader = (app) => {
  const fileList = readRecursiveDirectory('/src/api');

  fileList
    .filter((f) => f.includes('index.js'))
    .forEach((file) => {
      const routeFile = require(path.join(process.cwd(), file));
      const fn = file.replace('/src/api/', '').replace('index.js', '');

      app.use(`/api/${fn}`, routeFile());
    });

  console.info(`Routes successfully loaded`);

  // Expose API openAPI documentation
  // app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // 404 handler
  app.use((req, res, next) => {
    const error = new Error(`Cannot found '${req.url}' on this server`);
    error.code = 404;
    return next(error);
  });

  // Error handler
  app.use(errorHandler());
};

module.exports = routesLoader;
