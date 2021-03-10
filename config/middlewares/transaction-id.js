'use strict';

const uuid = require('uuid');

module.exports = () => (req, res, next) => {
  const transactionId = 'X-Transaction-Id';
  if (
    !req.headers[transactionId] ||
    (req.headers[transactionId] && req.headers[transactionId].trim() === '')
  ) {
    req[transactionId] = uuid.v1();
    res.setHeader(transactionId, req[transactionId]);
    next();
  } else {
    req[transactionId] = req.headers[transactionId];
    res.setHeader(transactionId, req[transactionId]);
    next();
  }
};
