import { describe, it, expect } from 'vitest';
import { UserRegister } from '../src/use-cases/RegisterUser';
import { createInMemoryUserRepository } from '../src/mocks/InMemoryUserRepository';

describe('UserRegister', () => {
  it('should register a new user successfully', async () => {
    const userRepo = createInMemoryUserRepository();

    const result = await UserRegister(
      { users: userRepo },
      { name: 'Alice', email: 'alice@example.com', password: 'securepass' }
    );

    expect(result).toBeUndefined(); 

    const storedUser = await userRepo.findByEmail('alice@example.com');
    expect(storedUser).not.toBeNull();
    expect(storedUser?.name).toBe('Alice');
  });

  it('should not allow registering with duplicate email', async () => {
    const userRepo = createInMemoryUserRepository();

    // Register first user
    await UserRegister(
      { users: userRepo },
      { name: 'Bob', email: 'bob@example.com', password: 'mypassword' }
    );

    // Try to register with same email
    const result = await UserRegister(
      { users: userRepo },
      { name: 'Bobby', email: 'bob@example.com', password: 'anotherpass' }
    );

    expect(result).toEqual(
      expect.objectContaining({ message: 'Email already in use' })
    );
  });

  it('should return error if email is empty', async () => {
    const userRepo = createInMemoryUserRepository();

    const result = await UserRegister(
      { users: userRepo },
      { name: 'EmptyEmail', email: '', password: '123456' }
    );

    expect(result).toEqual(
      expect.objectContaining({ message: 'Email must not be empty' })
    );
  });

  it('should return error if password is empty', async () => {
    const userRepo = createInMemoryUserRepository();

    const result = await UserRegister(
      { users: userRepo },
      { name: 'NoPass', email: 'nopass@example.com', password: '' }
    );

    expect(result).toEqual(
      expect.objectContaining({ message: 'Password must not be empty' })
    );
  });

  it('should return error if name is empty', async () => {
    const userRepo = createInMemoryUserRepository();

    const result = await UserRegister(
      { users: userRepo },
      { name: '', email: 'noname@example.com', password: 'pass123' }
    );

    expect(result).toEqual(
      expect.objectContaining({ message: 'Name must not be empty' })
    );
  });
});
