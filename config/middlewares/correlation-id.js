'use strict';

const uuid = require('uuid');

module.exports = () => (req, res, next) => {
  const correlationId = 'x-correlation-id';
  if (
    !req.headers[correlationId] ||
    (req.headers[correlationId] && req.headers[correlationId].trim() === '')
  ) {
    req.correlationId = uuid.v1();
    res.setHeader(correlationId, req.correlationId);
    next();
  } else {
    req.correlationId = req.headers[correlationId];
    res.setHeader(correlationId, req.correlationId);
    next();
  }
};
