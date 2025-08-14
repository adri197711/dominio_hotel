import { api } from "./axios";
import { Room } from "../types/Room";

export const RoomsService = {
  async getAll(): Promise<Room[]> {
    const res = await api.get<Room[]>("/rooms");
    return res.data;
  },

  async getById(id: string): Promise<Room> {
    const res = await api.get<Room>(`/rooms/${id}`);
    return res.data;
  },

  async create(room: Omit<Room, "id">): Promise<Room> {
    const res = await api.post<Room>("/rooms", room);
    return res.data;
  },

  async update(id: string, room: Partial<Room>): Promise<Room> {
    const res = await api.put<Room>(`/rooms/${id}`, room);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },
};
