import { Room } from '../../entities/Room';
import { RoomRepository } from '../interfaces/RoomRepository';

export class InMemoryRoomRepository implements RoomRepository {
  private rooms: Room[] = [];

  async findById(id: string): Promise<Room | null> {
    return this.rooms.find(room => room.id === id) ?? null;
  }

  async getAll(): Promise<Room[]> {
    return [...this.rooms];
  }

  async save(room: Room): Promise<void> {
    const index = this.rooms.findIndex(r => r.id === room.id);
    if (index !== -1) {
      this.rooms[index] = room;
    } else {
      this.rooms.push(room);
    }
  }
}