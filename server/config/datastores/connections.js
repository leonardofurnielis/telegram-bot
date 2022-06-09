'use strict';

module.exports = {
  database: {
    uri: process.env.DATABASE_URI,
    iam_api_key: process.env.DATABASE_APIKEY,
    adapter: 'mongodb',
    // ssl_ca_file: 'filename',
  },
};
