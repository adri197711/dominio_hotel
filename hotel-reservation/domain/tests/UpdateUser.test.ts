import { describe, test, expect, vi, beforeEach } from 'vitest';
import { updateUser, UserUpdateDependencies, UserUpdateRequestModel } from '../src/use-cases/user/UpdateUser';
import { createNotFoundError } from '../src/errors/error';
import { User } from '../src/entities/User';

describe('updateUser', () => {
  let userRepository: {
    findById: (id: string) => Promise<User | null>;
    update: (user: User) => Promise<User>;
  };
  let dependencies: UserUpdateDependencies;

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    };
    dependencies = { userRepository };
  });

  test('debe actualizar usuario correctamente si existe', async () => {
    let existingUser: User = { id: '1', name: 'Old Name', email: 'old@example.com' };
    let updatedUser: User = { id: '1', name: 'New Name', email: 'new@example.com' };

    (userRepository.findById as any).mockResolvedValue(existingUser);
    (userRepository.update as any).mockResolvedValue(updatedUser);

    const request: UserUpdateRequestModel = { userToUpdate: updatedUser };
    const result = await updateUser(dependencies, request);

    expect(userRepository.findById).toHaveBeenCalledWith('1');
    expect(userRepository.update).toHaveBeenCalledWith(updatedUser);
    expect(result).toEqual(updatedUser);
  });

  test('debe lanzar error NotFound si el usuario no existe', async () => {
    (userRepository.findById as any).mockResolvedValue(null);

    const request: UserUpdateRequestModel = {
      userToUpdate: { id: 'non-existent', name: 'Name', email: 'email@example.com' },
    };

    await expect(updateUser(dependencies, request)).rejects.toEqual(createNotFoundError('User not found'));
    expect(userRepository.findById).toHaveBeenCalledWith('non-existent');
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  test('debe propagar errores inesperados', async () => {
    (userRepository.findById as any).mockRejectedValue(new Error('DB error'));

    const request: UserUpdateRequestModel = {
      userToUpdate: { id: '1', name: 'Name', email: 'email@example.com' },
    };

    await expect(updateUser(dependencies, request)).rejects.toThrow('DB error');
  });
});
