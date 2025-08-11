import { ReservationRepository } from "../../../../domain/src/repositories/ReservationRepository";
import { RoomRepository } from "../../../../domain/src/repositories/RoomRepository";
import { Reservation } from "../../../../domain/src/entities/Reservation";

export function ReservationService(
  reservationRepo: ReservationRepository,
  roomRepo: RoomRepository
) {
  return {
    async createReservation(data: {
      userId: string;
      roomId: string;
      checkInDate: Date;
      checkOutDate: Date;
    }): Promise<Reservation> {
      if (data.checkOutDate <= data.checkInDate) {
        throw new Error("Check-out date must be after check-in date.");
      }

      const room = await roomRepo.findById(data.roomId);
      if (!room) throw new Error("Room not found.");
      if (room.status !== "available") throw new Error("Room not available.");

      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const days = Math.ceil((data.checkOutDate.getTime() - data.checkInDate.getTime()) / millisecondsPerDay);
      const totalPrice = room.pricePerNight * days;

      const reservation: Omit<Reservation, "id"> = {
        userId: data.userId,
        roomId: data.roomId,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        totalPrice,
        status: "pending",
      };

      // Aquí el repositorio debe asignar un id (p. ej. UUID)
      const savedReservation = await reservationRepo.save({
        ...reservation,
        id: "", // Dejar vacío o null para que lo genere repo si es necesario
      });

      // Cambiar estado de habitación a "booked"
      await roomRepo.save({ ...room, status: "booked" });

      return savedReservation;
    },

    async cancelReservation(id: string): Promise<void> {
      const reservation = await reservationRepo.findById(id);
      if (!reservation) throw new Error("Reservation not found.");

      reservation.status = "cancelled";
      await reservationRepo.save(reservation);

      // Liberar habitación
      const room = await roomRepo.findById(reservation.roomId);
      if (room) {
        await roomRepo.save({ ...room, status: "available" });
      }
    },

    async completeReservation(id: string): Promise<void> {
      const reservation = await reservationRepo.findById(id);
      if (!reservation) throw new Error("Reservation not found.");

      reservation.status = "completed";
      await reservationRepo.save(reservation);

      // Liberar habitación
      const room = await roomRepo.findById(reservation.roomId);
      if (room) {
        await roomRepo.save({ ...room, status: "available" });
      }
    },

    async getReservationById(id: string): Promise<Reservation | null> {
      return reservationRepo.findById(id);
    },

    async getAllReservations(): Promise<Reservation[]> {
      return reservationRepo.findAll();
    },

    async deleteReservation(id: string): Promise<void> {
      const deleted = await reservationRepo.delete(id);
      if (!deleted) throw new Error("Reservation not found");
    },
  };
}
