'use strict';

const server = async (req, res, next) => {
  try {
    const healthcheck = {
      status: 'UP',
      uptime: Math.floor(process.uptime()),
    };

    res.set('cache-control', 'no-cache');
    return res.status(200).json(healthcheck);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  server,
};
