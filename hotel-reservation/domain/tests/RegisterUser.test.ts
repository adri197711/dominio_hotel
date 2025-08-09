import { describe, test, expect, beforeEach } from 'vitest';
import { User, UserRole } from '../src/entities/User';
import { UserRegisterRequestModel, UserRegister, UserRegisterDependencies } from '../src/use-cases/user/RegisterUser';
import { createInMemoryUserRepository } from '../src/mocks/InMemoryUserRepository';
import { CryptoRepository } from '../src/repositories/CryptoRepository';

describe('UserRegister Use Case', () => {
  let userRepo: ReturnType<typeof createInMemoryUserRepository>;
    let cryptoRepo: CryptoRepository;
  let dependencies: UserRegisterDependencies;

  const existingUser: User = {
    id: 'existing-user-id',
    password: 'hashedpassword',
    email: 'existing@user.com',
    name: 'Existing User',
    role: 'user' as UserRole,
  };

  beforeEach(async () => {
    userRepo = createInMemoryUserRepository();

    cryptoRepo = {
      hashPassword: async (password: string) => `hashed-${password}`,
      comparePassword: async () => true,
      generateJWT: async () => 'fake-jwt',
      validateToken: async () => existingUser,
      generateRandomToken: async () => 'generated-id',
    };

    dependencies = { users: userRepo, crypto: cryptoRepo };

    await userRepo.register(existingUser); // register para agregar usuario inicial
  });

  test('should return error if email format is invalid', async () => {
    const payload: UserRegisterRequestModel = {
      email: 'invalid-email-format',
      password: '12345678',
      name: 'Test User',
    };

    const result = await UserRegister(dependencies, payload);

    expect(result).toMatchObject({
      type: 'InvalidData',
      message: 'Invalid email format',
    });
  });

  test('should return error if password is less than 6 characters', async () => {
    const payload: UserRegisterRequestModel = {
      email: 'valid@email.com',
      password: '12345',
      name: 'Test User',
    };

    const result = await UserRegister(dependencies, payload);

    expect(result).toMatchObject({
      type: 'InvalidData',
      message: 'Password must be at least 6 characters',
    });
  });
  test('should return error if name is only whitespace', async () => {
    const payload: UserRegisterRequestModel = {
      email: 'valid@email.com',
      password: '12345678',
      name: '   ',
    };

    const result = await UserRegister(dependencies, payload);

    expect(result).toMatchObject({
      type: 'InvalidData',
      message: 'Name must not be empty',
    });
  });

  test('should fail if email is already in use', async () => {
    const payload: UserRegisterRequestModel = {
      email: 'existing@user.com',
      password: '12345678',
      name: 'Test User',
    };

    const result = await UserRegister(dependencies, payload);

    expect(result).toMatchObject({
      type: 'InvalidData',
      message: 'Email already in use',
    });
  });

  test('should return error if email is empty', async () => {
    const payload: UserRegisterRequestModel = {
      email: '',
      password: '12345678',
      name: 'Test User',
    };

    const result = await UserRegister(dependencies, payload);

    expect(result).toMatchObject({
      type: 'InvalidData',
      message: 'Email must not be empty',
    });
  });

  test('should return error if password is empty', async () => {
    const payload: UserRegisterRequestModel = {
      email: 'valid@email.com',
      password: '',
      name: 'Test User',
    };

    const result = await UserRegister(dependencies, payload);

    expect(result).toMatchObject({
      type: 'InvalidData',
      message: 'Password must not be empty',
    });
  });

  test('should return error if name is empty', async () => {
    const payload: UserRegisterRequestModel = {
      email: 'valid@email.com',
      password: '12345678',
      name: '',
    };

    const result = await UserRegister(dependencies, payload);

    expect(result).toMatchObject({
      type: 'InvalidData',
      message: 'Name must not be empty',
    });
  });

  test('should register successfully with valid data', async () => {
    const payload: UserRegisterRequestModel = {
      email: 'valid@email.com',
      password: '12345678',
      name: 'User Test',
    };

    const result = await UserRegister(dependencies, payload);
    const user = await userRepo.findByEmail(payload.email);

    expect(result).toBeUndefined();
    expect(user).not.toBeNull();
    expect(user?.email).toBe(payload.email);
  });
});
