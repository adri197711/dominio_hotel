import { Reservation } from "../../../../../domain/src/entities/Reservation";
import { ReservationRepository } from "../../../../../domain/src/repositories/ReservationRepository";
import { ReservationModel } from "../models/reservation.models";

export function createSequelizeReservationRepository(): ReservationRepository {
  return {
    async findById(id: string): Promise<Reservation | null> {
      const res = await ReservationModel.findByPk(id);
      if (!res) return null;
      return {
        id: res.id,
        userId: res.userId,
        roomId: res.roomId,
        checkInDate: res.checkInDate,
        checkOutDate: res.checkOutDate,
        totalPrice: res.totalPrice,
        status: res.status,
      };
    },

    async findAll(): Promise<Reservation[]> {
      const reservations = await ReservationModel.findAll();
      return reservations.map(r => ({
        id: r.id,
        userId: r.userId,
        roomId: r.roomId,
        checkInDate: r.checkInDate,
        checkOutDate: r.checkOutDate,
        totalPrice: r.totalPrice,
        status: r.status,
      }));
    },

    async save(reservation: Reservation): Promise<Reservation> {
      const [model, created] = await ReservationModel.upsert(reservation, { returning: true });
      return {
        id: model.id,
        userId: model.userId,
        roomId: model.roomId,
        checkInDate: model.checkInDate,
        checkOutDate: model.checkOutDate,
        totalPrice: model.totalPrice,
        status: model.status,
      };
    },

    async delete(id: string): Promise<boolean> {
      const res = await ReservationModel.findByPk(id);
      if (!res) return false;
      await res.destroy();
      return true;
    }
  };
}
