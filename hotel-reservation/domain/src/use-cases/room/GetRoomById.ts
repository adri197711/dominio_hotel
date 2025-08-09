import { Room } from '../../entities/Room';
import { RoomRepository } from '../../repositories/RoomRepository';

export interface GetRoomByIdDependencies {
  roomRepository: RoomRepository;
}

export async function GetRoomById(
  { roomRepository }: GetRoomByIdDependencies,
  id: string
): Promise<Room | null> {
  return await roomRepository.findById(id);
}
