'use strict';

const server = async (req, res, next) => {
  try {
    const response = {
      status: 'UP',
      uptime: Math.floor(process.uptime()),
    };

    res.set('cache-control', 'no-cache');
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  server,
};
