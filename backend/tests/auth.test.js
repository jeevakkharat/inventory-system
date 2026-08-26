/**
 * Smoke test for the login flow. Requires a running MongoDB (replica set)
 * with MONGODB_URI configured and the seed script already run.
 * Run with: npm test
 */
const mongoose = require('mongoose');
const request = require('supertest');
require('dotenv').config();
const app = require('../src/app');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth API', () => {
  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('logs in with valid seeded admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin@123' });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('Admin');
  });
});
