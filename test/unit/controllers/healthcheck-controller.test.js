'use strict';

const request = require('supertest');
const app = require('../../../server');

describe('GET /api/health', () => {
  test('When called, should return 200', () => {
    request(app)
      .get('/api/health')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('When called, should have all keys', () => {
    request(app)
      .get('/api/health')
      .then((response) => {
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('node_version');
        expect(response.body).toHaveProperty('sys');
      });
  });
});
