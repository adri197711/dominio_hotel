import { ReservationRepository } from '../../repositories/ReservationRepository';
import { RoomRepository } from '../../repositories/RoomRepository';
import { ChangeRoomStatus } from '../room';

export interface CompleteReservationDependencies {
  reservationRepository: ReservationRepository;
  roomRepository: RoomRepository;
}

export async function CompleteReservation(
  { reservationRepository, roomRepository }: CompleteReservationDependencies,
  reservationId: string
): Promise<void> {
  const reservation = await reservationRepository.findById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found.');
  }

  reservation.status = 'completed';
  await reservationRepository.save(reservation);

  await ChangeRoomStatus({ roomRepository }, { id: reservation.roomId, status: 'available' });
}
