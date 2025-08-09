import { Room, RoomType } from '../../entities/Room';
import { RoomRepository } from '../../repositories/RoomRepository';
import { v4 as uuidv4 } from 'uuid';
import { createInMemoryRoomRepository } from '../../InMemoryRoomRepository';
import { UserRegisterRequestModel, UserRegister, UserRegisterDependencies } from '../src/use-cases/user/RegisterUser';

export interface CreateRoomDependencies {
  roomRepository: RoomRepository;
}

export interface CreateRoomRequestModel {
  number: string;
  type: RoomType;
  pricePerNight: number;
}

export async function CreateRoom(
  { roomRepository }: CreateRoomDependencies,
  { number, type, pricePerNight }: CreateRoomRequestModel
): Promise<Room> {

  const existingRooms = await roomRepository.getAll();
  if (existingRooms.some(r => r.number === number)) {
    throw new Error('Room number already exists.');
  }

  const room: Room = {
    id: uuidv4(),
    number,
    type,
    pricePerNight,
    status: 'available',
  };

  await roomRepository.save(room);
  return room;
}
