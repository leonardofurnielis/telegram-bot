/* eslint-disable global-require */

'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const fs = require('fs');
const path = require('path');

module.exports = () => {
  const publicKEY = fs.readFileSync(path.join(__dirname, '../__keys__/jwtRSA256.pub.pem'));
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = publicKEY;
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      return done(null, jwtPayload);
    })
  );
};
