import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('User Registration', () => {
  it('should register a user successfully', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should fail when email is missing', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        password: 'password123',
        name: 'Test User',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email must not be empty');
  });

  it('should fail when password is too short', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        email: 'another@test.com',
        password: '123',
        name: 'Test User',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Password must be at least 6 characters');
  });
});
