import { Reservation } from '../entities/Reservation';

export interface ReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findByUserId(userId: string): Promise<Reservation[]>;
save(reservation: Omit<Reservation, 'id'>): Promise<Reservation>;

  update(reservation: Reservation): Promise<void>;
  delete(reservationId: string): Promise<void>;
}