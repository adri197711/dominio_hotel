import { ReservationRepository } from '../../repositories/ReservationRepository';
import { RoomRepository } from '../../repositories/RoomRepository';
import { ChangeRoomStatus } from '../room';

export interface CancelReservationDependencies {
  reservationRepository: ReservationRepository;
  roomRepository: RoomRepository;
}

export async function CancelReservation(
  { reservationRepository, roomRepository }: CancelReservationDependencies,
  reservationId: string
): Promise<void> {
  const reservation = await reservationRepository.findById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found.');
  }

  reservation.status = 'cancelled';
  await reservationRepository.save(reservation);

  await ChangeRoomStatus({ roomRepository }, { id: reservation.roomId, status: 'available' });
}
