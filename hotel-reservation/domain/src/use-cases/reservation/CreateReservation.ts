import { Reservation } from '../../entities/Reservation';
import { ReservationRepository } from '../../repositories/ReservationRepository';
import { RoomRepository } from '../../repositories/RoomRepository';
import { ChangeRoomStatus } from '../room';
import { v4 as uuidv4 } from 'uuid';

export interface CreateReservationDependencies {
  reservationRepository: ReservationRepository;
  roomRepository: RoomRepository;
}

export interface CreateReservationRequestModel {
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
}

export async function CreateReservation(
  { reservationRepository, roomRepository }: CreateReservationDependencies,
  { userId, roomId, checkInDate, checkOutDate }: CreateReservationRequestModel
): Promise<Reservation> {

  const room = await roomRepository.findById(roomId);
  if (!room) {
    throw new Error('Room not found.');
  }

  if (room.status === 'booked') {
    throw new Error('Room is already booked.');
  }

  const reservation: Reservation = {
    id: uuidv4(),
    userId,
    roomId,
    checkInDate,
    checkOutDate,
    status: 'pending',
  };

  await reservationRepository.save(reservation);

  await ChangeRoomStatus({ roomRepository }, { id: roomId, status: 'booked' });
 
  return reservation;
}
