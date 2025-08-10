import { describe, test, expect, vi, beforeEach } from 'vitest';
import { UserLogin, UserLoginDependencies, UserLoginRequestModel } from '../src/use-cases/user/UserLogin';

describe('login', () => {
  let users: { findByEmail: (email: string) => Promise<any | null> };
  let crypto: {
    comparePassword: (plain: string, hashed: string) => Promise<boolean>;
  };
  let tokens: {
    generateToken: (payload: any) => Promise<string>;
  };
  let dependencies: UserLoginDependencies;

  beforeEach(() => {
    users = {
      findByEmail: vi.fn(),
    };
    crypto = {
      comparePassword: vi.fn(),
    };
    tokens = {
      generateToken: vi.fn(),
    };
    dependencies = { users, crypto, tokens };
  });

  test('debería retornar token si el login es exitoso', async () => {
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashed-password',
      role: 'guest',
      name: 'Test User',
    };
    (users.findByEmail as any).mockResolvedValue(user);
    (crypto.comparePassword as any).mockResolvedValue(true);
    (tokens.generateToken as any).mockResolvedValue('jwt-token');

    const request: UserLoginRequestModel = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    const result = await UserLogin(dependencies, request);

    expect(users.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(crypto.comparePassword).toHaveBeenCalledWith('correct-password', 'hashed-password');
    expect(tokens.generateToken).toHaveBeenCalledWith({ id: 'user-1', role: 'guest' });
    expect(result).toEqual({
      token: 'jwt-token',
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'guest',
      },
    });
  });

  test('debería lanzar error si la contraseña es inválida', async () => {
    const user = { id: 'user-1', password: 'hashed-password', role: 'guest' };
    (users.findByEmail as any).mockResolvedValue(user);
    (crypto.comparePassword as any).mockResolvedValue(false);

    const request: UserLoginRequestModel = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    await expect(UserLogin(dependencies, request)).rejects.toThrow('Invalid email or password');
    expect(users.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(crypto.comparePassword).toHaveBeenCalledWith('wrong-password', 'hashed-password');
  });

  test('debería lanzar error si el usuario no existe', async () => {
    (users.findByEmail as any).mockResolvedValue(null);

    const request: UserLoginRequestModel = {
      email: 'nonexistent@example.com',
      password: 'any-password',
    };

    await expect(UserLogin(dependencies, request)).rejects.toThrow('Invalid email or password');
    expect(users.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
  });
});
