import { describe, it, expect } from 'vitest';
import { reservationRepository, roomRepository } from './setup';
import { CancelReservation } from '../src/use-cases/CancelReservation';
import { v4 as uuidv4 } from 'uuid';

describe('CancelReservation', () => {
  it('should cancel a reservation and mark room as available', async () => {
    const roomId = uuidv4();
    const reservationId = uuidv4();

    await roomRepository.save({
      id: roomId,
      number: '103',
      type: 'double',
      pricePerNight: 120,
      status: 'booked',
    });

    await reservationRepository.save({
      id: reservationId,
      userId: uuidv4(),
      roomId,
      checkInDate: new Date(),
      checkOutDate: new Date(),
      status: 'confirmed',
    });

    const cancelReservation = new CancelReservation(reservationRepository, roomRepository);
    await cancelReservation.execute(reservationId);

    const updatedRoom = await roomRepository.findById(roomId);
    const updatedReservation = await reservationRepository.findById(reservationId);

    expect(updatedRoom?.status).toBe('available');
    expect(updatedReservation?.status).toBe('cancelled');
  });
});
