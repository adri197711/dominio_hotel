import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CreateRoom,
  GetAllRooms,
  GetRoomById,
  UpdateRoom,
  DeleteRoom,
} from '../../../../../domain/src/use-cases/room';

const mockRoomRepo = {
  findById: vi.fn(),
  getAll: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CreateRoom', () => {
  it('should create room with unique number', async () => {
    mockRoomRepo.getAll.mockResolvedValue([]);
    mockRoomRepo.save.mockResolvedValue();

    const room = await CreateRoom(
      { roomRepository: mockRoomRepo },
      { number: '101', type: 'single', pricePerNight: 100 }
    );
    expect(room).toHaveProperty('number', '101');
    expect(mockRoomRepo.save).toHaveBeenCalled();
  });

  it('should fail if room number exists', async () => {
    mockRoomRepo.getAll.mockResolvedValue([{ number: '101' }]);
    await expect(
      CreateRoom({ roomRepository: mockRoomRepo }, { number: '101', type: 'single', pricePerNight: 100 })
    ).rejects.toThrow('Room number already exists.');
  });
});

describe('GetAllRooms', () => {
  it('should get all rooms', async () => {
    const mockRooms = [{ id: '1', number: '101' }];
    mockRoomRepo.getAll.mockResolvedValue(mockRooms);

    const rooms = await GetAllRooms({ roomRepository: mockRoomRepo });
    expect(rooms).toHaveLength(mockRooms.length);
    expect(rooms).toEqual(mockRooms);
  });
});

describe('GetRoomById', () => {
  it('should find room by id', async () => {
    const mockRoom = { id: '1', number: '101' };
    mockRoomRepo.findById.mockResolvedValue(mockRoom);

    const room = await GetRoomById({ roomRepository: mockRoomRepo }, '1');
    expect(room).toEqual(mockRoom);
  });

  it('should return null if room not found', async () => {
    mockRoomRepo.findById.mockResolvedValue(null);
    const room = await GetRoomById({ roomRepository: mockRoomRepo }, '999');
    expect(room).toBeNull();
  });
});

describe('UpdateRoom', () => {
  it('should update room', async () => {
    const existingRoom = { id: '1', number: '101', pricePerNight: 100 };
    mockRoomRepo.findById.mockResolvedValue(existingRoom);
    mockRoomRepo.save.mockResolvedValue();

    const updated = await UpdateRoom(
      { roomRepository: mockRoomRepo },
      { id: '1', pricePerNight: 150 }
    );
    expect(updated).toHaveProperty('pricePerNight', 150);
    expect(mockRoomRepo.save).toHaveBeenCalledWith(expect.objectContaining({ pricePerNight: 150 }));
  });

  it('should throw if room not found', async () => {
    mockRoomRepo.findById.mockResolvedValue(null);
    await expect(
      UpdateRoom({ roomRepository: mockRoomRepo }, { id: '1', pricePerNight: 150 })
    ).rejects.toThrow('Room not found.');
  });
});

describe('DeleteRoom', () => {
  it('should delete room', async () => {
    mockRoomRepo.findById.mockResolvedValue({ id: '1' });
    mockRoomRepo.delete.mockResolvedValue();

    await expect(DeleteRoom({ roomRepository: mockRoomRepo }, '1')).resolves.toBeUndefined();
    expect(mockRoomRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw if room not found', async () => {
    mockRoomRepo.findById.mockResolvedValue(null);
    await expect(DeleteRoom({ roomRepository: mockRoomRepo }, '1')).rejects.toThrow('Room not found.');
  });
});
