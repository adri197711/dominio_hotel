import { describe, it, expect, beforeEach } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { createInMemoryRoomRepository } from '../src/mocks/InMemoryRoomRepository';
import { createInMemoryReservationRepository } from '../src/mocks/InMemoryReservationRepository';
import { CreateReservation } from '../src/use-cases/CreateReservation';

describe('CreateReservation', () => {
  let roomRepository;
  let reservationRepository;

  beforeEach(() => {
    roomRepository = createInMemoryRoomRepository();
    reservationRepository = createInMemoryReservationRepository();
  });

  it('should create a reservation and mark room as booked', async () => {
    const roomId = uuidv4();
    await roomRepository.save({
      id: roomId,
      number: '101',
      type: 'single',
      pricePerNight: 100,
      status: 'available',
    });

    const userId = uuidv4();

    const reservation = await CreateReservation(
      { roomRepository, reservationRepository },
      {
        userId,
        roomId,
        checkInDate: new Date(),
        checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    );

    expect(reservation.roomId).toBe(roomId);

    const updatedRoom = await roomRepository.findById(roomId);
    expect(updatedRoom?.status).toBe('booked');

    const savedReservation = await reservationRepository.findById(reservation.id);
    expect(savedReservation).not.toBeNull();
  });
});
