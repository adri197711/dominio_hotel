import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createInMemoryReservationRepository } from '../src/mocks/InMemoryReservationRepository';
import { createInMemoryRoomRepository } from '../src/mocks/InMemoryRoomRepository';
import * as roomUseCases from '../src/use-cases/room'; // Importamos todo como namespace para mocks
import { CompleteReservation, CompleteReservationDependencies } from '../src/use-cases/reservation/CompleteReservation';

// Mocks globales
vi.mock('uuid', () => ({ v4: () => 'mock-uuid' }));
vi.mock('../src/use-cases/room', () => ({
  ChangeRoomStatus: vi.fn(),
}));

describe('Reservation Use Cases', () => {
  let reservationRepository = createInMemoryReservationRepository();
  let roomRepository = createInMemoryRoomRepository();
  let dependencies: CompleteReservationDependencies;

  beforeEach(async () => {
    vi.clearAllMocks();

    reservationRepository = createInMemoryReservationRepository();
    roomRepository = createInMemoryRoomRepository();

    await roomRepository.save({
      id: 'room-2',
      number: '102',
      type: 'suite',
      pricePerNight: 250,
      status: 'booked',
    });

    await reservationRepository.save({
      id: 'res-1',
      userId: 'user-1',
      roomId: 'room-2',
      checkInDate: new Date(),
      checkOutDate: new Date(),
      status: 'pending',
    });
  });

  describe('CompleteReservation', () => {
    beforeEach(() => {
      dependencies = { reservationRepository, roomRepository };
    });

    test('should change reservation status to completed and room status to available', async () => {
      await CompleteReservation(dependencies, 'res-1');
      const reservation = await reservationRepository.findById('res-1');

      expect(reservation?.status).toBe('completed');
      expect(roomUseCases.ChangeRoomStatus).toHaveBeenCalledWith(
        { roomRepository },
        { id: 'room-2', status: 'available' }
      );
    });

    test('should throw an error if reservation is not found', async () => {
      await expect(CompleteReservation(dependencies, 'non-existent-res')).rejects.toThrow('Reservation not found.');
    });
  });
});

