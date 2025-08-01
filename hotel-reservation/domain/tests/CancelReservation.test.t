import { describe, it, expect } from 'vitest';
import { CancelReservation } from '../src/use-cases/CancelReservation';
import { v4 as uuidv4 } from 'uuid';
import { createInMemoryRoomRepository } from '../src/mocks/InMemoryRoomRepository';
import { createInMemoryReservationRepository } from '../src/mocks/InMemoryReservationRepository';

describe('CancelReservation', () => {
  it('should cancel a reservation and mark room as available', async () => {
    const roomId = uuidv4();
    const reservationId = uuidv4();

 await createInMemoryRoomRepository.save({
      id: roomId,
      number: '103',
      type: 'double',
      pricePerNight: 120,
      status: 'booked',
    });

await createInMemoryReservationRepository.save({
      id: reservationId,
      userId: uuidv4(),
      roomId,
      checkInDate: new Date(),
      checkOutDate: new Date(),
      status: 'confirmed',
    });

    const cancelReservation = new CancelReservation(createInMemoryReservationRepository, createInMemoryRoomRepository);
    await cancelReservation.execute(reservationId);

    const updatedRoom = await createInMemoryRoomRepository.findById(roomId);
    const updatedReservation = await createInMemoryReservationRepository.findById(reservationId);

    expect(updatedRoom?.status).toBe('available');
    expect(updatedReservation?.status).toBe('cancelled');
  });
});
