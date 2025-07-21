import { User } from '../../entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  getAll(): Promise<User[]>;
}