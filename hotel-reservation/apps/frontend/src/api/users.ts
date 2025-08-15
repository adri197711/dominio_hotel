import { api } from "./axios";
import { User } from "../types/User";

export const UsersService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const res = await api.post("/users", user);
    return res.data;
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const res = await api.put(`/users/${id}`, user);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
export const AuthService = {
  isAuthenticated: (): boolean => {
    return false;
  },
  getToken: (): string | null => {
    return null;
  }
};