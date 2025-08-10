import { describe, test, expect, vi, beforeEach } from 'vitest';
import { deleteUser, DeleteUserDependencies, DeleteUserRequestModel } from '../src/use-cases/user/DeleteUser';
import { createNotFoundError } from '../src/errors/error';

describe('deleteUser', () => {
  let userRepository: {
    findById: (id: string) => Promise<any | null>;
    delete: (id: string) => Promise<void>;
  };
  let dependencies: DeleteUserDependencies;

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    };
    dependencies = { userRepository };
  });

  test('debe eliminar un usuario existente', async () => {
    (userRepository.findById as any).mockResolvedValue({ id: 'user-1', name: 'Test User' });
    (userRepository.delete as any).mockResolvedValue(undefined);

    await expect(deleteUser(dependencies, { id: 'user-1' })).resolves.toBeUndefined();

    expect(userRepository.findById).toHaveBeenCalledWith('user-1');
    expect(userRepository.delete).toHaveBeenCalledWith('user-1');
  });

  test('debe lanzar error si el usuario no existe', async () => {
    (userRepository.findById as any).mockResolvedValue(null);

    await expect(deleteUser(dependencies, { id: 'non-existent-id' })).rejects.toThrow('User not found');

    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
