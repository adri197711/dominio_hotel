import { describe, test, expect, vi, beforeEach } from 'vitest';
import { login, UserLoginDependencies, UserLoginRequestModel } from '../src/use-cases/user/UserLogin';


describe('login', () => {
  let userRepository: {
    findByEmail: (email: string) => Promise<any | null>;
  };
  let cryptoRepository: {
    comparePassword: (plain: string, hashed: string) => Promise<boolean>;
    generateJWT: (user: any) => Promise<string>;
  };
  let dependencies: UserLoginDependencies;

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
    };
    cryptoRepository = {
      comparePassword: vi.fn(),
      generateJWT: vi.fn(),
    };
    dependencies = { userRepository, cryptoRepository };
  });

  test('debería retornar token si el login es exitoso', async () => {
    const user = { id: 'user-1', password: 'hashed-password' };
    (userRepository.findByEmail as any).mockResolvedValue(user);
    (cryptoRepository.comparePassword as any).mockResolvedValue(true);
    (cryptoRepository.generateJWT as any).mockResolvedValue('jwt-token');

    const request: UserLoginRequestModel = {
      email: 'test@example.com',
      password: 'correct-password',
    };

    const result = await login(dependencies, request);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(cryptoRepository.comparePassword).toHaveBeenCalledWith('correct-password', 'hashed-password');
    expect(cryptoRepository.generateJWT).toHaveBeenCalledWith(user);
    expect(result).toEqual({ token: 'jwt-token' });
  });

  test('debería lanzar error si la contraseña es inválida', async () => {
    const user = { id: 'user-1', password: 'hashed-password' };
    (userRepository.findByEmail as any).mockResolvedValue(user);
    (cryptoRepository.comparePassword as any).mockResolvedValue(false);

    const request: UserLoginRequestModel = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    await expect(login(dependencies, request)).rejects.toThrow('401 Unauthorized');
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(cryptoRepository.comparePassword).toHaveBeenCalledWith('wrong-password', 'hashed-password');
  });

  test('debería lanzar error si el usuario no existe', async () => {
    (userRepository.findByEmail as any).mockResolvedValue(null);

    const request: UserLoginRequestModel = {
      email: 'nonexistent@example.com',
      password: 'any-password',
    };

    await expect(login(dependencies, request)).rejects.toThrow('401 Unauthorized');
    expect(userRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
  });
});
