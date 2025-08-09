import { describe, test, expect, beforeEach } from 'vitest';

import {
  CreateRoom, CreateRoomDependencies,
  GetAllRooms, GetAllRoomsDependencies,
  GetRoomById, GetRoomByIdDependencies, 
  UpdateRoom, UpdateRoomDependencies,
  DeleteRoom, DeleteRoomDependencies,
  
} from '../src/use-cases/room'
import { v4 as uuidv4 } from 'uuid';
import { RoomType } from '../src/entities/Room';
import { createInMemoryRoomRepository } from '../src/mocks/InMemoryRoomRepository'
import { vi } from 'vitest';
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

describe('Room Use Cases', () => {
  let roomRepository: ReturnType<typeof createInMemoryRoomRepository>;

  beforeEach(async () => {
    roomRepository = createInMemoryRoomRepository();
    // Setup inicial de datos para los tests
    await roomRepository.save({
      id: 'room-1',
      number: '101',
      type: 'single',
      pricePerNight: 100,
      status: 'available',
    });
    await roomRepository.save({
      id: 'room-2',
      number: '102',
      type: 'double',
      pricePerNight: 250,
      status: 'booked',
    });
  });

  // --- Tests para GetAllRooms ---
  describe('GetAllRooms', () => {
    test('should return all rooms', async () => {
      const dependencies: GetAllRoomsDependencies = { roomRepository };
      const rooms = await GetAllRooms(dependencies);

      expect(rooms).toHaveLength(2);
      expect(rooms[0].number).toBe('101');
      expect(rooms[1].number).toBe('102');
    });
  });

  // --- Tests para GetRoomById ---
  describe('GetRoomById', () => {
    test('should return a room if the ID exists', async () => {
      const dependencies: GetRoomByIdDependencies = { roomRepository };
      const room = await GetRoomById(dependencies, 'room-1');

      expect(room).not.toBeNull();
      expect(room?.number).toBe('101');
    });

    test('should return null if the ID does not exist', async () => {
      const dependencies: GetRoomByIdDependencies = { roomRepository };
      const room = await GetRoomById(dependencies, 'non-existent-id');

      expect(room).toBeNull();
    });
  });

  // --- Tests para CreateRoom ---
  describe('CreateRoom', () => {
    let dependencies: CreateRoomDependencies;
    
  beforeEach(() => {
    dependencies = { roomRepository };
  });


    test('should create a new room with a unique number', async () => {
      const newRoomData = {
        number: '103',
        type: 'suite' as RoomType,
        pricePerNight: 150,
      };
      const createdRoom = await CreateRoom(dependencies, newRoomData);
      const roomInRepo = await roomRepository.findById('mock-uuid');

      expect(createdRoom).toEqual({
        id: 'mock-uuid',
        ...newRoomData,
        status: 'available',
      });
      expect(roomInRepo).toEqual(createdRoom);
    });

    test('should throw an error if the room number already exists', async () => {
      const existingRoomData = {
        number: '101', // Este número ya existe
        type: 'suite' as RoomType,
        pricePerNight: 120,
      };

      await expect(CreateRoom(dependencies, existingRoomData)).rejects.toThrow('Room number already exists.');
    });
  });

// --- Tests para UpdateRoom ---
describe('UpdateRoom', () => {
  let dependencies: UpdateRoomDependencies;

  beforeEach(() => {
    dependencies = { roomRepository };
  });

  test('should update a room with new data', async () => {
    const updateData = {
      id: 'room-1',
      number: '105',
      pricePerNight: 120,
    };

    const updatedRoom = await UpdateRoom(dependencies, updateData);
    const roomInRepo = await roomRepository.findById('room-1');

    expect(updatedRoom.number).toBe('105');
    expect(updatedRoom.pricePerNight).toBe(120);
    expect(roomInRepo?.number).toBe('105');
  });

  test('should throw an error if the room to update is not found', async () => {
    const updateData = {
      id: 'non-existent-id',
      number: '999',
    };

    await expect(UpdateRoom(dependencies, updateData)).rejects.toThrow('Room not found.');
  });
});
});



