import { describe, it, expect } from 'vitest';
import { registerUser, userRepository } from './setup';

describe('RegisterUser', () => {
  it('should register a new user successfully', async () => {
    const user = await registerUser.execute('Alice', 'alice@example.com', 'password');
    expect(user.email).toBe('alice@example.com');

    const storedUser = await userRepository.findByEmail('alice@example.com');
    expect(storedUser).not.toBeNull();
  });

  it('should not allow duplicate emails', async () => {
    await registerUser.execute('Bob', 'bob@example.com', 'password');
    await expect(
      registerUser.execute('Bob Again', 'bob@example.com', 'password')
    ).rejects.toThrowError('Email is already registered.');
  });
});