import { describe, test, expect, beforeEach } from 'vitest';
import { DeleteRoom, DeleteRoomDependencies } from '../src/use-cases/room';
import { createInMemoryRoomRepository } from '../src/mocks/InMemoryRoomRepository';

describe('Room Use Cases', () => {
  let roomRepository: ReturnType<typeof createInMemoryRoomRepository>;
  let dependencies: DeleteRoomDependencies;

  beforeEach(async () => {
    roomRepository = createInMemoryRoomRepository();

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

    dependencies = { roomRepository };
  });

  describe('DeleteRoom', () => {
    test('should delete a room if the ID exists', async () => {
      const initialRooms = await roomRepository.getAll();
      expect(initialRooms).toHaveLength(2);

      await DeleteRoom(dependencies, 'room-1');

      const roomsAfterDeletion = await roomRepository.getAll();
      expect(roomsAfterDeletion).toHaveLength(1);
      expect(roomsAfterDeletion.find(r => r.id === 'room-1')).toBeUndefined();
    });

    test('should throw an error if the room to delete is not found', async () => {
      await expect(DeleteRoom(dependencies, 'non-existent-id')).rejects.toThrow('Room not found.');
    });
  });
});
