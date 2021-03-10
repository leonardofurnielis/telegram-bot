'use strict';

const log4js = require('log4js');

log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    stderr: { type: 'stderr' },
    stderrFilter: {
      type: 'logLevelFilter',
      appender: 'stderr',
      level: 'error',
      maxLevel: 'error',
    },
    stdoutFilter: {
      type: 'logLevelFilter',
      appender: 'stdout',
      level: 'debug',
      maxLevel: 'warn',
    },
  },
  categories: {
    default: {
      appenders: ['stderrFilter', 'stdoutFilter'],
      level: 'debug',
    },
  },
});

module.exports = async (name = 'telegram-bot-sentiment') => {
  const logger = log4js.getLogger(name);
  logger.level = process.env.LOGGER_LEVEL || 'debug';

  global.console.debug = (...args) => {
    logger.debug(...args);
  };

  global.console.log = (...args) => {
    logger.debug(...args);
  };

  global.console.info = (...args) => {
    logger.info(...args);
  };

  global.console.warn = (...args) => {
    logger.warn(...args);
  };

  global.console.error = (...args) => {
    logger.error(...args);
  };

  process.env.LOGGER_LEVEL = logger.level;
};
