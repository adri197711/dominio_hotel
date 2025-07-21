import { describe, it, expect } from 'vitest';
import { userRepository, roomRepository, createReservation } from './setup';
import { v4 as uuidv4 } from 'uuid';

describe('CreateReservation', () => {
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

    const reservation = await createReservation.execute(
      userId,
      roomId,
      new Date(),
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

    expect(reservation.roomId).toBe(roomId);

    const updatedRoom = await roomRepository.findById(roomId);
    expect(updatedRoom?.status).toBe('booked');
  });
});
