'use strict';

const express = require('express');

const server = require('./config');

const app = express();

server.create(app);
server.listen(app);
