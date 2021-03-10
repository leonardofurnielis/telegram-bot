'use strict';

const liveness = async (req, res, next) => {
  try {
    const memory = process.memoryUsage();

    const healthcheck = {
      uptime: Math.floor(process.uptime()),
      version: process.version,
      resources: {
        memory: Math.floor(memory.heapUsed * 10 ** -6),
      },
    };

    return res.status(200).json(healthcheck);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  liveness,
};
