'use strict';

const request = require('supertest');
const app = require('../../../../config');

describe('GET /api/liveness', () => {
  test('When called, should return 200', () => {
    request(app)
      .get('/api/liveness')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('When called, should have all keys', () => {
    request(app)
      .get('/api/liveness')
      .then((response) => {
        expect(response.body).to.have.all.keys('uptime', 'version', 'sys');
      });
  });
});
