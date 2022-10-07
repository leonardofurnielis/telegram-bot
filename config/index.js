/* eslint-disable global-require */

'use strict';

// Import dependencies
const express = require('express');
const errorHandler = require('node-error-handler');

// Import config dependencies
const app = express();
const environmentLoader = require('./environment');
const logLoader = require('./log');
const httpLoader = require('./http');
const securityLoader = require('./security');

// Import routes dependencies
const healthRoute = require('./routes/health');

// Import telegram webhook start
const telegram = require('../src/services/telegram');

environmentLoader();

logLoader();

httpLoader(app);

// Routes and api calls
app.use('/api/health', healthRoute());

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Cannot found '${req.url}' on this server`);
  error.code = 404;
  return next(error);
});

// Error handler
const debug = process.env.LOGGER_LEVEL.toLowerCase() === 'debug' ? true : false;
app.use(errorHandler({ debug }));

if (!process.env.NODE_ENV === 'test') {
  securityLoader();
}

// Telegram webhook start
telegram.start();

module.exports = app;
