import { mockUserGuest, mockUserAdmin } from '../stories/fixtures';
import { User } from '../types/User';

export const UsersService = {
  getAll: async (): Promise<User[]> => {
    return [mockUserGuest, mockUserAdmin];
  },
  getById: async (id: string): Promise<User | null> => {
    return id === mockUserGuest.id ? mockUserGuest : id === mockUserAdmin.id ? mockUserAdmin : null;
  },
};
