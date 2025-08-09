import { User } from '../entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  getAll(): Promise<User[]>;
  register(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>
}