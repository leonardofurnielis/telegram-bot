const express = require('express');
const controller = require('../../src/controllers/health_controller');

module.exports = (middlewares) => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach((middleware) => router.use(middleware));
  }

  router.get('/', controller.server);

  return router;
};
