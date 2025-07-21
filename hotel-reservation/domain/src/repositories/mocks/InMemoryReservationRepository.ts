import { Reservation } from '../../entities/Reservation';
import { ReservationRepository } from '../interfaces/ReservationRepository';

export class InMemoryReservationRepository implements ReservationRepository {
  private reservations: Reservation[] = [];

  async findById(id: string): Promise<Reservation | null> {
    return this.reservations.find(r => r.id === id) ?? null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    return this.reservations.filter(r => r.userId === userId);
  }

  async save(reservation: Reservation): Promise<void> {
    const index = this.reservations.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      this.reservations[index] = reservation;
    } else {
      this.reservations.push(reservation);
    }
  }

  async update(reservation: Reservation): Promise<void> {
    await this.save(reservation);
  }

  async delete(reservationId: string): Promise<void> {
    this.reservations = this.reservations.filter(r => r.id !== reservationId);
  }
}