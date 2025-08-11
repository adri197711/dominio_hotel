import { Room } from "../../../../domain/src/entities/Room";
import { RoomRepository } from "../../../../domain/src/repositories/RoomRepository";

export function createRoomService(roomRepo: RoomRepository) {
  return {
    async createRoom(data: { number: string; type: string; pricePerNight: number }): Promise<Room> {
      const existingRooms = await roomRepo.getAll();
      if (existingRooms.some(r => r.number === Number(data.number))) {
        throw new Error("Room number already exists");
      }

      const room: Room = {
        id: "", // repositorio genera el id
        number: Number(data.number),
        type: data.type as Room["type"],
        pricePerNight: data.pricePerNight,
        status: "available",
      };

      return await roomRepo.save(room);
    },

    async getAllRooms(): Promise<Room[]> {
      return roomRepo.getAll();
    },

    async getRoomById(id: string): Promise<Room | null> {
      return roomRepo.findById(id);
    },

    async updateRoom(id: string, data: Partial<Omit<Room, "id">>): Promise<Room> {
      const existingRoom = await roomRepo.findById(id);
      if (!existingRoom) throw new Error("Room not found");

      const updatedRoom = { ...existingRoom, ...data };
      return roomRepo.save(updatedRoom);
    },

    async deleteRoom(id: string): Promise<boolean> {
      return roomRepo.delete(id);
    },
  };
}
