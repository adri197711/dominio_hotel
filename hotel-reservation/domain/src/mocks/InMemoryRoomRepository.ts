import { Room } from '../entities/Room';
import { RoomRepository } from '../repositories/RoomRepository';

export const createInMemoryRoomRepository = (): RoomRepository => {
  let rooms: Room[] = [];

  return {
    findById(id: string): Promise<Room | null> {
      const result = rooms.find(room => room.id === id) ?? null;
      return Promise.resolve(result);
    },

    getAll(): Promise<Room[]> {
      return Promise.resolve([...rooms]);
    },

    save(room: Room): Promise<void> {
      const index = rooms.findIndex(r => r.id === room.id);
      if (index !== -1) {
        rooms[index] = room;
      } else {
        rooms.push(room);
      }
      return Promise.resolve();
    }
  };
};
