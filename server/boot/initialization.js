/* eslint-disable global-require */

'use strict';

// An asynchronous function that runs on your app invoke.

module.exports = async () => {
  const telegram_bot = require('../../lib/services/telegram');

  telegram_bot.listen();
};
