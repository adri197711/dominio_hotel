import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { createInvalidDataError, InvalidDataError } from '../errors/error';

export interface UserRegisterDependencies {
  users: UserRepository;
  crypto: {
    hashPassword(password: string): Promise<string>;
    generateRandomToken(): Promise<string>;
  };
}

export type UserRegisterRequestModel = Omit<User, 'id' | 'role'>;

export async function UserRegister(
  { users, crypto }: UserRegisterDependencies,
  { email, password, name }: UserRegisterRequestModel
): Promise<InvalidDataError | void> {
  // Validaciones...
  // (igual que en tu código)
}
