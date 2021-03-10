/* eslint-disable global-require */

'use strict';

const express = require('express');

const app = express();
const environmentLoader = require('./environment');
const logLoader = require('./log');
const httpLoader = require('./http');
const routesLoader = require('./routes');
const bootstrapLoader = require('./bootstrap');

environmentLoader();

logLoader();

httpLoader(app);

routesLoader(app);

bootstrapLoader();

module.exports = app;
