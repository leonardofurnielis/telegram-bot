/* eslint-disable global-require */

'use strict';

// An asynchronous function that runs before your app start.

module.exports = async () => {
  const telegram = require('../src/helpers/telegram');

  telegram.start();
};
