/* eslint-disable global-require */

'use strict';

const fs = require('fs');
const path = require('path');
const errorHandler = require('node-error-handler');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('swagger.json');

/**
 * Read recursive directory.
 * @param {String} dir - The directory path to start read.
 * @param {Array} filelist - List of directory.
 * @returns {Array} - The complete list of directory.
 */
const readRecursiveDirectory = (dir, filelist = []) => {
  try {
    const pathDir = path.join(process.cwd(), dir);
    const files = fs.readdirSync(pathDir);
    files.forEach((file) => {
      if (fs.statSync(path.join(pathDir, file)).isDirectory()) {
        filelist = readRecursiveDirectory(path.join(dir, file), filelist);
      } else {
        filelist.push(path.join(dir, file).replace(/(\\\\|\\)/g, '/'));
      }
    });

    return filelist;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

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
  const debug = process.env.LOGGER_LEVEL.toLowerCase() === 'debug' ? true : false;
  app.use(errorHandler({ debug }));
};

module.exports = routesLoader;
