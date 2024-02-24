'use strict';

const request = require('supertest');
const app = require('../../../');

describe('GET /api/liveness', () => {
  test('It should return 200', () => {
    request(app)
      .get('/api/liveness')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should have properties status and uptime', () => {
    request(app)
      .get('/api/liveness')
      .then((response) => {
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('uptime');
      });
  });
});
