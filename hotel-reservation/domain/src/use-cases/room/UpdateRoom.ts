import { Room, RoomType, RoomStatus } from '../../entities/Room';
import { RoomRepository } from '../../repositories/RoomRepository';

export interface UpdateRoomDependencies {
  roomRepository: RoomRepository;
}

export interface UpdateRoomRequestModel {
  id: string;
  number?: string;
  type?: RoomType;
  pricePerNight?: number;
  status?: RoomStatus;
}

export async function UpdateRoom(
  { roomRepository }: UpdateRoomDependencies,
  { id, number, type, pricePerNight, status }: UpdateRoomRequestModel
): Promise<Room> {
  const room = await roomRepository.findById(id);
  if (!room) {
    throw new Error('Room not found.');
  }

  if (number) room.number = number;
  if (type) room.type = type;
  if (pricePerNight !== undefined) room.pricePerNight = pricePerNight;
  if (status) room.status = status;

  await roomRepository.save(room);
  return room;
}
