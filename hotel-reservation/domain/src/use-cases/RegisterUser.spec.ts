import { describe, test, expect, beforeEach } from 'vitest';
import { User, UserRole } from '../entities/User';
import { UserRegister, UserRegisterDependencies, UserRegisterRequestModel } from './RegisterUser';
import { createInvalidDataError } from '../errors/error';
import { createInMemoryUserRepository, UserRepositoryMock } from '../mocks/InMemoryUserRepository';

describe('UserRegister Use Case', () => {
    let userRepo: UserRepositoryMock;
    let dependencies: UserRegisterDependencies;

    const existingUser: User = {
        id: 'existing user id',
        password: '12345678',
        email: 'existing@user.com',
        name: 'Existing User',
        role: 'user' as UserRole,
    };

    beforeEach(async () => {
        userRepo = createInMemoryUserRepository();
        dependencies = {
            users: userRepo,
        };
        await userRepo.save(existingUser);
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
