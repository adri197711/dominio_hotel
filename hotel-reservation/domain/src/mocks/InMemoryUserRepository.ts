import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export function createInMemoryUserRepository(users: User[] = []): UserRepository {
  
  return {
    async findByEmail(email: string): Promise<User | null> {
      const user = users.find(u => u.email === email);
      return user ? { ...user } : null;
    },

    async findById(id: string): Promise<User | null> {
      const user = users.find(u => u.id === id);
      return user ? { ...user } : null;
    },

    async save(user: User): Promise<void> {
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
      } else {
        users.push(user);
      }
    },

    async update(user: User): Promise<User> {
      const index = users.findIndex(u => u.id === user.id);
      if (index === -1) {
        throw new Error(`User with id ${user.id} not found`);
      }
      users[index] = user;
      return { ...user };
    },

    async delete(id: string): Promise<boolean> {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    },

    async getAll(): Promise<User[]> {
      return [...users];
    },

  
  };
}
