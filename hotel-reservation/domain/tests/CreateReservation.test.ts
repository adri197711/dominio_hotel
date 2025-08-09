import { describe, test, expect, beforeEach, vi } from 'vitest';
import * as roomUseCases from '../src/use-cases/room';
import { CreateReservation, CreateReservationDependencies } from '../src/use-cases/reservation/CreateReservation';
import { createInMemoryReservationRepository } from '../src/mocks/InMemoryReservationRepository';
import { createInMemoryRoomRepository } from '../src/mocks/InMemoryRoomRepository';

vi.mock('uuid', () => ({ v4: () => 'mock-uuid' }));
vi.mock('../src/use-cases/room', () => ({
  ChangeRoomStatus: vi.fn(),
}));

describe('CreateReservation', () => {
  let reservationRepository = createInMemoryReservationRepository();
  let roomRepository = createInMemoryRoomRepository();
  let dependencies: CreateReservationDependencies;
  let availableRoom: { id: string };
  let bookedRoom: { id: string };

  beforeEach(async () => {
    vi.clearAllMocks();

    reservationRepository = createInMemoryReservationRepository();
    roomRepository = createInMemoryRoomRepository();

    availableRoom = {
      id: 'room-1',
      number: '101',
      type: 'standard',
      pricePerNight: 100,
      status: 'available',
    };

    bookedRoom = {
      id: 'room-2',
      number: '102',
      type: 'suite',
      pricePerNight: 250,
      status: 'booked',
    };

    await roomRepository.save(availableRoom);
    await roomRepository.save(bookedRoom);

    dependencies = { reservationRepository, roomRepository };
  });

  test('should create a new reservation and change room status to booked', async () => {
    const payload = {
      userId: 'user-2',
      roomId: availableRoom.id,
      checkInDate: new Date(),
      checkOutDate: new Date(),
    };

    const result = await CreateReservation(dependencies, payload);
    const reservationInRepo = await reservationRepository.findById('mock-uuid');

    expect(result).toEqual({ id: 'mock-uuid', ...payload, status: 'pending' });
    expect(reservationInRepo).not.toBeNull();
    expect(roomUseCases.ChangeRoomStatus).toHaveBeenCalledWith(
      { roomRepository },
      { id: availableRoom.id, status: 'booked' }
    );
  });

  test('should throw an error if room is not found', async () => {
    const payload = {
      userId: 'user-2',
      roomId: 'non-existent-room',
      checkInDate: new Date(),
      checkOutDate: new Date(),
    };
    await expect(CreateReservation(dependencies, payload)).rejects.toThrow('Room not found.');
  });

  test('should throw an error if room is already booked', async () => {
    const payload = {
      userId: 'user-2',
      roomId: bookedRoom.id,
      checkInDate: new Date(),
      checkOutDate: new Date(),
    };
    await expect(CreateReservation(dependencies, payload)).rejects.toThrow('Room is already booked.');
  });
});
