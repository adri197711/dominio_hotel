import { Reservation } from '../entities/Reservation';
import { ReservationRepository } from '../repositories/ReservationRepository';

export const createInMemoryReservationRepository = (): ReservationRepository => {
  let reservations: Reservation[] = [];

  return {
    findById(id: string): Promise<Reservation | null> {
      const result = reservations.find(r => r.id === id) ?? null;
      return Promise.resolve(result);
    },

    findByUserId(userId: string): Promise<Reservation[]> {
      const result = reservations.filter(r => r.userId === userId);
      return Promise.resolve(result);
    },

    save(reservation: Reservation): Promise<void> {
      const index = reservations.findIndex(r => r.id === reservation.id);
      if (index !== -1) {
        reservations[index] = reservation;
      } else {
        reservations.push(reservation);
      }
      return Promise.resolve();
    },

    update(reservation: Reservation): Promise<void> {
      return this.save(reservation);
    },

    delete(reservationId: string): Promise<void> {
      reservations = reservations.filter(r => r.id !== reservationId);
      return Promise.resolve();
    }
  };
};
