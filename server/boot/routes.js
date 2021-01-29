/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

'use strict';

const path = require('path');
const read_recursive_directory = require('../../lib/helpers/read-recursive-directory.js');

// const swagger_ui = require('swagger-ui-express');
// const basic_auth = require('../lib/middlewares/www-basic-auth');
// const swagger_document = require('../swagger/swagger.json');

const routes_loader = (app) => {
  const routes = read_recursive_directory('/api/routes');

  routes.forEach((file) => {
    const routeFile = require(path.join(process.cwd(), file));
    const fn = file.replace('/api/routes/', '').replace('.js', '');

    app.use(`/api/${fn}`, routeFile());
    console.debug(`Route Loaded Successfully: /api/${fn}`);
  });

  // Expose API openapi documentation
  // app.use('/explorer', basic_auth(), swagger_ui.serve, swagger_ui.setup(swagger_document));
};

module.exports = routes_loader;
