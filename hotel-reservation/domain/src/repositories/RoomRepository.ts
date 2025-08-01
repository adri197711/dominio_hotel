import { Room } from '../entities/Room';

export interface RoomRepository {
  findById(id: string): Promise<Room | null>;
  getAll(): Promise<Room[]>;
  save(room: Room): Promise<void>;
}