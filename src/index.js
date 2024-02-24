/* eslint-disable global-require */

'use strict';

const express = require('express');
const error_handler = require('node-error-handler');

const app = express();
const environment_loader = require('./config/environment');
const log_loader = require('./config/log');
const http_loader = require('./config/http');
const security_loader = require('./config/security');
const route_loader = require('./config/route');
const telegram = require('./api/services/telegram');

// Loading environment configurations
environment_loader();

// Loading log configurations
log_loader();

// Loading HTTP configurations
http_loader(app);

// Mounting API routes
app.use('/api', route_loader());

// Handling 404 errors for routes not found
app.use((req, res, next) => {
  const error = new Error(`Cannot found '${req.url}' on this server`);
  error.code = 404;
  return next(error);
});

// Error handling middleware
const debug = process.env.LOGGER_LEVEL.toLowerCase() === 'debug' ? true : false;
app.use(error_handler({ debug }));

// Loading security configurations, if not in test environment
if (!process.env.NODE_ENV === 'test') {
  security_loader();
}

// Telegram webhook start
if (process.env.TELEGRAM_BOT_TOKEN) {
  telegram.start();
} else {
  console.error(
    '`TELEGRAM_BOT_TOKEN` is required. Please check that environment variables was loaded'
  );
}

module.exports = app;
