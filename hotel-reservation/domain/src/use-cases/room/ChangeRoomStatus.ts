import { Room, RoomStatus } from '../../entities/Room';
import { RoomRepository } from '../../repositories/RoomRepository';

export interface ChangeRoomStatusDependencies {
  roomRepository: RoomRepository;
}

export interface ChangeRoomStatusRequestModel {
  id: string;
  status: RoomStatus;
}

export async function ChangeRoomStatus(
  { roomRepository }: ChangeRoomStatusDependencies,
  { id, status }: ChangeRoomStatusRequestModel
): Promise<Room> {
  const room = await roomRepository.findById(id);
  if (!room) {
    throw new Error('Room not found.');
  }

  if (room.status === status) {
    throw new Error(`Room is already in status '${status}'.`);
  }

  room.status = status;
  await roomRepository.save(room);

  return room;
}
