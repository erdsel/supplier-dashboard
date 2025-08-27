import request from 'supertest';
import app from '../app';
import Vendor from '../models/Vendor';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new vendor', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Vendor',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.vendor).toHaveProperty('id');
      expect(response.body.vendor.name).toBe('Test Vendor');
      expect(response.body.vendor.email).toBe('test@example.com');
    });

    it('should not register vendor with duplicate email', async () => {
      await Vendor.create({
        name: 'Existing Vendor',
        email: 'existing@example.com',
        password: await bcrypt.hash('password123', 10),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Vendor',
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await Vendor.create({
        name: 'Login Test Vendor',
        email: 'login@example.com',
        password: hashedPassword,
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.vendor.email).toBe('login@example.com');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login-by-name', () => {
    beforeEach(async () => {
      await Vendor.create({
        name: 'Test Vendor Name',
        email: 'vendor@example.com',
      });
    });

    it('should login by vendor name', async () => {
      const response = await request(app)
        .post('/api/auth/login-by-name')
        .send({
          name: 'Test Vendor Name',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.vendor.name).toBe('Test Vendor Name');
    });

    it('should return error for non-existent vendor', async () => {
      const response = await request(app)
        .post('/api/auth/login-by-name')
        .send({
          name: 'Non Existent Vendor',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});