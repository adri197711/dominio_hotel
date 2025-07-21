import { User } from '../../entities/User';
import { UserRepository } from '../interfaces/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) ?? null;
  }

  async save(user: User): Promise<void> {
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    if (existingIndex !== -1) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  async getAll(): Promise<User[]> {
    return [...this.users];
  }
}