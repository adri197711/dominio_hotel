import { api } from "./axios";
import { Reservation } from "../types/Reservation";

export const ReservationsService = {
  async getAll(): Promise<Reservation[]> {
    const res = await api.get<Reservation[]>("/reservations");
    return res.data;
  },

  async getById(id: string): Promise<Reservation> {
    const res = await api.get<Reservation>(`/reservations/${id}`);
    return res.data;
  },

  async create(reservation: Omit<Reservation, "id">): Promise<Reservation> {
    const res = await api.post<Reservation>("/reservations", reservation);
    return res.data;
  },

  async update(id: string, reservation: Partial<Reservation>): Promise<Reservation> {
    const res = await api.put<Reservation>(`/reservations/${id}`, reservation);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/reservations/${id}`);
  },
};
