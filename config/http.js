'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
// const passport = require('passport');
const rateLimit = require('express-rate-limit');

const transactionId = require('./middlewares/transaction-id');

module.exports = async (app) => {
  app.set('trust proxy', 1);

  const limiter = rateLimit({
    windowMs: 1000,
    max: 100,
  });

  // Middlewares
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(compression());
  app.use(limiter);
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.use(transactionId());
};
