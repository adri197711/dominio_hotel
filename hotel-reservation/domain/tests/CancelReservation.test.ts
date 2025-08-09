import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createInMemoryReservationRepository } from '../src/mocks/InMemoryReservationRepository';
import { createInMemoryRoomRepository } from '../src/mocks/InMemoryRoomRepository';
import * as roomUseCases from '../src/use-cases/room'; // Importamos todo como namespace para mocks
import { CancelReservation, CancelReservationDependencies } from '../src/use-cases/reservation/CancelReservation';

// Mocks globales
vi.mock('uuid', () => ({ v4: () => 'mock-uuid' }));
vi.mock('../src/use-cases/room', () => ({
  ChangeRoomStatus: vi.fn(),
}));

describe('Reservation Use Cases', () => {
  let reservationRepository = createInMemoryReservationRepository();
  let roomRepository = createInMemoryRoomRepository();
  let dependencies: CancelReservationDependencies;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Repositorios limpios y poblados con datos nuevos
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

    dependencies = { reservationRepository, roomRepository };
  });

  describe('CancelReservation', () => {
    test('should change reservation status to cancelled and room status to available', async () => {
      await CancelReservation(dependencies, 'res-1');

      const reservation = await reservationRepository.findById('res-1');

      expect(reservation?.status).toBe('cancelled');
      expect(roomUseCases.ChangeRoomStatus).toHaveBeenCalledWith(
        { roomRepository },
        { id: 'room-2', status: 'available' }
      );
    });

    test('should throw an error if reservation is not found', async () => {
      await expect(CancelReservation(dependencies, 'non-existent-res')).rejects.toThrow(
        'Reservation not found.'
      );
    });
  });
});
