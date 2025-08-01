import { ReservationRepository } from '../repositories/ReservationRepository';
import { RoomRepository } from '../repositories/RoomRepository';

export interface CancelReservationDependencies {
  reservationRepository: ReservationRepository;
  roomRepository: RoomRepository;
}

export interface CancelReservationRequestModel {
  reservationId: string;
}

export async function CancelReservation(
  { reservationRepository, roomRepository }: CancelReservationDependencies,
  { reservationId }: CancelReservationRequestModel
): Promise<void> {
  const reservation = await reservationRepository.findById(reservationId);
  if (!reservation) throw new Error('Reservation not found.');

  reservation.status = 'cancelled';
  await reservationRepository.update(reservation);

  const room = await roomRepository.findById(reservation.roomId);
  if (room) {
    room.status = 'available';
    await roomRepository.save(room);
  }
}
