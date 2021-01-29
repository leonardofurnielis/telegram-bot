'use strict';

const express = require('express');

const server = require('./server');

async function start_server() {
  const app = express();

  server.listen(app);
}

start_server();
