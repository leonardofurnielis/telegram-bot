'use strict';

const path = require('path');
const dotenv = require('dotenv');

module.exports = async () => {
  const result = dotenv.config({ path: path.resolve(`${__dirname}/env/.env`) });

  if (result.error) {
    throw result.error;
  }
};
