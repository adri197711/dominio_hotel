import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  UserRegister,
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
  UserLogin,
} from  '../../../../../domain/src/use-cases/user'; 
import { createInvalidDataError } from '../../../../../domain/src/errors/error';

const mockUserRepo = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  register: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockCryptoRepo = {
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
  generateRandomToken: vi.fn(),
};

const mockTokenRepo = {
  generateToken: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('UserRegister', () => {
  it('should register a valid user', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockCryptoRepo.hashPassword.mockResolvedValue('hashedpass');
    mockCryptoRepo.generateRandomToken.mockResolvedValue('token123');
    mockUserRepo.register.mockResolvedValue();

    const result = await UserRegister(
      { users: mockUserRepo, crypto: mockCryptoRepo },
      { email: 'test@example.com', password: 'password123', name: 'Test User' }
    );

    expect(result).toBeUndefined();
    expect(mockUserRepo.register).toHaveBeenCalled();
  });

  it('should fail on existing email', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ email: 'test@example.com' });

    const result = await UserRegister(
      { users: mockUserRepo, crypto: mockCryptoRepo },
      { email: 'test@example.com', password: 'password123', name: 'Test User' }
    );

    expect(result).toHaveProperty('message', 'Email already in use');
  });
});

describe('findUsers', () => {
  it('should return list of users', async () => {
    mockUserRepo.findAll.mockResolvedValue([{ id: '1', name: 'User1' }]);
    const users = await findUsers({ userRepository: mockUserRepo });
    expect(users).toHaveLength(1);
  });
});
describe('deleteUser', () => {
  it('should delete existing user', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: '1' });
    mockUserRepo.delete.mockResolvedValue();

    await expect(deleteUser({ userRepository: mockUserRepo }, { id: '1' })).resolves.toBeUndefined();
  });

  it('should throw if user not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(deleteUser({ userRepository: mockUserRepo }, { id: '2' })).rejects.toThrow();
  });
});

describe('findUserById', () => {
  it('should find user by id', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: '1', name: 'User1' });
    const user = await findUserById({ userRepository: mockUserRepo }, { id: '1' });
    expect(user).toHaveProperty('id', '1');
  });

  it('should throw if user not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(findUserById({ userRepository: mockUserRepo }, { id: '2' })).rejects.toThrow();
  });
});

describe('updateUser', () => {
  it('should update user', async () => {
    const userToUpdate = { id: '1', name: 'User1 Updated' };
    mockUserRepo.findById.mockResolvedValue(userToUpdate);
    mockUserRepo.update.mockResolvedValue(userToUpdate);

    const updated = await updateUser({ userRepository: mockUserRepo }, { userToUpdate });
    expect(updated).toHaveProperty('name', 'User1 Updated');
  });

  it('should throw if user not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(updateUser({ userRepository: mockUserRepo }, { userToUpdate: { id: '2', name: 'X' } })).rejects.toThrow();
  });
});


describe('UserLogin', () => {
  it('should login successfully', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashedpass',
      name: 'User1',
      role: 'guest',
    });
    mockCryptoRepo.comparePassword.mockResolvedValue(true);
    mockTokenRepo.generateToken.mockResolvedValue('token123');

    const response = await UserLogin(
      { users: mockUserRepo, crypto: mockCryptoRepo, tokens: mockTokenRepo },
      { email: 'test@example.com', password: 'password123' }
    );

    expect(response).toHaveProperty('token', 'token123');
    expect(response.user).toHaveProperty('email', 'test@example.com');
  });

  it('should fail login with invalid password', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashedpass',
      name: 'User1',
      role: 'guest',
    });
    mockCryptoRepo.comparePassword.mockResolvedValue(false);

    await expect(
      UserLogin(
        { users: mockUserRepo, crypto: mockCryptoRepo, tokens: mockTokenRepo },
        { email: 'test@example.com', password: 'wrongpass' }
      )
    ).rejects.toThrow();
  });
});
