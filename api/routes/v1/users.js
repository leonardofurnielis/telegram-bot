'use strict';

const express = require('express');
const controller = require('../../controllers/v1/users');

module.exports = (middlewares) => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach((middleware) => router.use(middleware));
  }

  router.get('/', controller.list);
  router.post('/', controller.insert);
  router.get('/:id', controller.find);
  router.put('', controller.update);
  router.delete('/:id', controller.remove);

  return router;
};
