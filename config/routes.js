/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

'use strict';

const path = require('path');
const errorHandler = require('node-error-handler');

const readRecursiveDirectory = require('../services/read-recursive-directory');

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('swagger.json');

const routesLoader = (app) => {
  const fileList = readRecursiveDirectory('/app/api');

  fileList
    .filter((f) => f.includes('index.js'))
    .forEach((file) => {
      const routeFile = require(path.join(process.cwd(), file));
      const fn = file.replace('/app/api/', '').replace('index.js', '');

      app.use(`/api/${fn}`, routeFile());
    });

  console.info(`Routes successfully loaded`);

  // Expose API openAPI documentation
  // app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
