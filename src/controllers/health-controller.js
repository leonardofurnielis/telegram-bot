'use strict';

const health = async (req, res, next) => {
  try {
    const memory = process.memoryUsage();

    const healthcheck = {
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      node_version: process.version,
      sys: {
        heap_total: `${(memory.heapTotal * 10 ** -6).toFixed(2)}mb`,
        heap_used: `${(memory.heapUsed * 10 ** -6).toFixed(2)}mb`,
      },
    };

    return res.status(200).json(healthcheck);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  health,
};
