'use strict';

const express = require('express');
const controller = require('./liveness-controller');

module.exports = (middlewares) => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach((middleware) => router.use(middleware));
  }

  router.get('/', controller.liveness);

  return router;
};
