import { RoomRepository } from '../../repositories/RoomRepository';

export interface DeleteRoomDependencies {
  roomRepository: RoomRepository;
}

export async function DeleteRoom(
  { roomRepository }: DeleteRoomDependencies,
  id: string
): Promise<void> {
  const room = await roomRepository.findById(id);
  if (!room) {
    throw new Error('Room not found.');
  }

  await roomRepository.delete(id);
}
