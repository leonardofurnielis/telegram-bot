'use strict';

module.exports = () =>
  function raise_url_not_found_error(req, res, next) {
    const error = new Error(`Cannot found '${req.url}' on this server`);
    error.code = 404;
    return next(error);
  };
