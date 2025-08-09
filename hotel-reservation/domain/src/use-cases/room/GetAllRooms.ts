import { Room } from '../../entities/Room';
import { RoomRepository } from '../../repositories/RoomRepository';

export interface GetAllRoomsDependencies {
  roomRepository: RoomRepository;
}

export async function GetAllRooms(
  { roomRepository }: GetAllRoomsDependencies
): Promise<Room[]> {
  return await roomRepository.getAll();
}
