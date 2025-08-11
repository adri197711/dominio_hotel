import { describe, it, expect, vi, beforeEach } from 'vitest';

// Ajustá la ruta relativa según tu estructura real:
import {
  CreateReservation,
  CancelReservation,
  CompleteReservation,
} from '../../../../../domain/src/use-cases/reservation/index';

const mockReservationRepo = {
  findById: vi.fn(),
  getAll: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

const mockRoomRepo = {
  findById: vi.fn(),
  save: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CreateReservation', () => {
  it('should create reservation if room is available', async () => {
    mockRoomRepo.findById.mockResolvedValue({ id: 'room1', status: 'available' });
    mockReservationRepo.save.mockResolvedValue();

    const reservation = await CreateReservation(
      { reservationRepository: mockReservationRepo, roomRepository: mockRoomRepo },
      {
        userId: 'user1',
        roomId: 'room1',
        checkInDate: new Date(),
        checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }
    );

    expect(reservation).toHaveProperty('roomId', 'room1');
    expect(mockReservationRepo.save).toHaveBeenCalled();
    expect(mockRoomRepo.save).toHaveBeenCalled(); // Because ChangeRoomStatus saves the room as booked
  });

  it('should fail if room is booked', async () => {
    mockRoomRepo.findById.mockResolvedValue({ id: 'room1', status: 'booked' });

    await expect(
      CreateReservation(
        { reservationRepository: mockReservationRepo, roomRepository: mockRoomRepo },
        {
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date(),
          checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        }
      )
    ).rejects.toThrow('Room is already booked.');
  });
});

describe('CancelReservation', () => {
  it('should cancel reservation and free room', async () => {
    mockReservationRepo.findById.mockResolvedValue({
      id: 'res1',
      roomId: 'room1',
      status: 'pending',
    });
    mockReservationRepo.save.mockResolvedValue();
    mockRoomRepo.findById.mockResolvedValue({ id: 'room1', status: 'booked' });
    mockRoomRepo.save.mockResolvedValue();

    await CancelReservation(
      { reservationRepository: mockReservationRepo, roomRepository: mockRoomRepo },
      'res1'
    );

    expect(mockReservationRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'cancelled' })
    );
    expect(mockRoomRepo.save).toHaveBeenCalled();
  });

  it('should throw if reservation not found', async () => {
    mockReservationRepo.findById.mockResolvedValue(null);
    await expect(
      CancelReservation({ reservationRepository: mockReservationRepo, roomRepository: mockRoomRepo }, 'res1')
    ).rejects.toThrow('Reservation not found.');
  });
});


describe('CompleteReservation', () => {
  it('should complete reservation and free room', async () => {
    mockReservationRepo.findById.mockResolvedValue({
      id: 'res1',
      roomId: 'room1',
      status: 'pending',
    });
    mockReservationRepo.save.mockResolvedValue();
    mockRoomRepo.findById.mockResolvedValue({ id: 'room1', status: 'booked' });
    mockRoomRepo.save.mockResolvedValue();

    await CompleteReservation(
      { reservationRepository: mockReservationRepo, roomRepository: mockRoomRepo },
      'res1'
    );

    expect(mockReservationRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'completed' })
    );
    expect(mockRoomRepo.save).toHaveBeenCalled();
  });

  it('should throw if reservation not found', async () => {
    mockReservationRepo.findById.mockResolvedValue(null);
    await expect(
      CompleteReservation({ reservationRepository: mockReservationRepo, roomRepository: mockRoomRepo }, 'res1')
    ).rejects.toThrow('Reservation not found.');
  });
  
});
