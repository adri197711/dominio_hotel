import { api } from "./axios";
import { User } from "../types/User";

export const UsersService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get<User[]>("/users");
    return res.data;
  },


  async getById(id: string): Promise<User> {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  async create(user: Omit<User, "id">): Promise<User> {
    const res = await api.post<User>("/users", user);
    return res.data;
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    const res = await api.put<User>(`/users/${id}`, user);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
