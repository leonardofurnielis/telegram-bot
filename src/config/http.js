'use strict';

const cors = require('cors');
const body_parser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const rate_limit = require('express-rate-limit');
const transaction_id = require('express-transaction-id');

module.exports = async (app) => {
  app.set('trust proxy', 1);

  const limiter = rate_limit({
    windowMs: 1000,
    max: 100,
  });

  // Middlewares
  app.use(cors());
  app.use(helmet());
  app.use(body_parser.urlencoded({ extended: true }));
  app.use(body_parser.json());
  app.use(compression());
  app.use(transaction_id());
  app.use(limiter);
  app.use(passport.initialize());
  // app.use(passport.session());
};
