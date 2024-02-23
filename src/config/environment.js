'use strict';

const path = require('path');
const dotenv = require('dotenv');

module.exports = async () => {
  const result = dotenv.config({
    path: path.join(__dirname, `../../.env`),
  });

  if (result.error) {
    console.warn(
      `\x1b[33m [${new Date().toISOString()}] [WARN] app - Failed to load environment variables from file. Please check that the /.env file exists at the project root`
    );
    console.warn(
      `\x1b[33m [${new Date().toISOString()}] [WARN] app - Either ensure that environment variables have been loaded previously, to prevent error in the application`
    );
  }
};
