/**
 * Smoke tests for auth flow using an in-memory MongoDB when no MONGODB_URI is set.
 */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
require('dotenv').config();
const app = require('../src/app');
const Role = require('../src/models/Role');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || (await (async () => {
    mongoServer = await MongoMemoryServer.create();
    return mongoServer.getUri();
  })());

  await mongoose.connect(uri, { dbName: 'inventory-asset-management-test' });

  const role = await Role.findOneAndUpdate(
    { name: 'Admin' },
    { name: 'Admin' },
    { upsert: true, new: true }
  );

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  await User.findOneAndUpdate(
    { email: 'admin@example.com' },
    { name: 'Admin User', email: 'admin@example.com', passwordHash, role: role._id, status: 'ACTIVE' },
    { upsert: true, new: true }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
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

  it('registers a new user without a roleId and assigns the default employee role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Employee',
        email: 'newemployee@example.com',
        password: 'NewPassword123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('Employee');
  });
});
