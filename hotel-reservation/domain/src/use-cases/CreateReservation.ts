import { Reservation } from '../entities/Reservation';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateReservation {
  constructor(
    private reservationRepository: ReservationRepository,
    private roomRepository: RoomRepository
  ) {}

  async execute(
    userId: string,
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<Reservation> {
    const room = await this.roomRepository.findById(roomId);
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

    await this.reservationRepository.save(reservation);

    room.status = 'booked';
    await this.roomRepository.save(room);

    return reservation;
  }
}