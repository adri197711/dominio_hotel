import { describe, test, expect, vi, beforeEach } from 'vitest';
import { findUsers, FindUsersDependencies } from '../src/use-cases/user/FindUsers';

describe('findUsers', () => {
  let userRepository: {
    findAll: () => Promise<any[]>;
  };
  let dependencies: FindUsersDependencies;

  beforeEach(() => {
    userRepository = {
      findAll: vi.fn(),
    };
    dependencies = { userRepository };
  });

  test('debe devolver todos los usuarios', async () => {
    const mockUsers = [
      { id: '1', name: 'User One', email: 'one@example.com' },
      { id: '2', name: 'User Two', email: 'two@example.com' },
    ];
    (userRepository.findAll as any).mockResolvedValue(mockUsers);

    const users = await findUsers(dependencies);

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(users).toEqual(mockUsers);
  });

  test('debe devolver array vacío si no hay usuarios', async () => {
    (userRepository.findAll as any).mockResolvedValue([]);

    const users = await findUsers(dependencies);

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(users).toEqual([]);
  });

  test('debe propagar errores del repositorio', async () => {
    (userRepository.findAll as any).mockRejectedValue(new Error('DB error'));

    await expect(findUsers(dependencies)).rejects.toThrow('DB error');
  });
});
