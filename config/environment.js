'use strict';

const path = require('path');
const dotenv = require('dotenv');

module.exports = async () => {
  const result = dotenv.config({
     path: path.join(__dirname, `./env/.env`),
  });

  if (result.error) {
    console.debug(
      `Failed to load environment variables. Please check that the /env/.${
        process.env.NODE_ENV || 'env'
      } file exists.`
    );
  }
};
