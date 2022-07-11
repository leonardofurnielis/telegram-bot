'use strict';

const server = async (req, res, next) => {
  try {
    const memory = process.memoryUsage();

    const healthcheck = {
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      node_version: process.version,
      sys: {
        mem_total: `${(memory.heapTotal * 10 ** -6).toFixed(2)}mb`,
        mem_used: `${(memory.heapUsed * 10 ** -6).toFixed(2)}mb`,
      },
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
