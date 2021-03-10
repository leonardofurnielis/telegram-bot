/* eslint-disable global-require */

'use strict';

// An asynchronous function that runs before your app start.

module.exports = async () => {
  const telegramBot = require('../services/telegram');

  telegramBot.listen();
};
