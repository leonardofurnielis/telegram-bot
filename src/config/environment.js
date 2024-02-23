'use strict';

const path = require('path');
const dotenv = require('dotenv');

module.exports = async () => {
  const result = dotenv.config({
    path: path.join(__dirname, `../../.env`),
  });

  if (result.error) {
    console.debug(
      'Failed to load environment variables file. Please check that the /.env file exists at the project root'
    );
  }
};
