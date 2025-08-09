import { describe, test, expect, vi, beforeEach } from 'vitest';
import { findUserById, UserFindByIdDependencies, UserFindByIdRequestModel } from '../src/use-cases/user/findUserById';
import { createNotFoundError } from '../src/errors/error';

describe('findUserById', () => {
  let userRepository: {
    findById: (id: string) => Promise<any | null>;
  };
  let dependencies: UserFindByIdDependencies;

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
    };
    dependencies = { userRepository };
  });

  test('debe devolver el usuario si existe', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    (userRepository.findById as any).mockResolvedValue(mockUser);

    const request: UserFindByIdRequestModel = { id: '1' };
    const result = await findUserById(dependencies, request);

    expect(userRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockUser);
  });

  test('debe lanzar error si el usuario no existe', async () => {
    (userRepository.findById as any).mockResolvedValue(null);

    const request: UserFindByIdRequestModel = { id: 'non-existent-id' };
    await expect(findUserById(dependencies, request)).rejects.toMatchObject(createNotFoundError("User not found"));

    expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
  });
});
