import { ReservationRepository } from '../repositories/ReservationRepository';
import { RoomRepository } from '../repositories/RoomRepository';

export class CancelReservation {
  constructor(
    private reservationRepository: ReservationRepository,
    private roomRepository: RoomRepository
  ) {}

  async execute(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) throw new Error('Reservation not found.');

    reservation.status = 'cancelled';
    await this.reservationRepository.update(reservation);

    const room = await this.roomRepository.findById(reservation.roomId);
    if (room) {
      room.status = 'available';
      await this.roomRepository.save(room);
    }
  }
}