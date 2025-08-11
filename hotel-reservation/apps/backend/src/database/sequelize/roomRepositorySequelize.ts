import { Room } from "../../../../../domain/src/entities/Room";
import { RoomRepository } from "../../../../../domain/src/repositories/RoomRepository";
import { RoomModel } from "../../database/models/room.models";

export function createSequelizeRoomRepository(): RoomRepository {
  return {
    async getAll() {
      const rooms = await RoomModel.findAll();
      return rooms.map(r => ({
        id: r.id,
        number: r.number,
        type: r.type,
        pricePerNight: Number(r.pricePerNight),
        status: r.status,
      }));
    },

    async findById(id: string) {
      const room = await RoomModel.findByPk(id);
      if (!room) return null;
      return {
        id: room.id,
        number: room.number,
        type: room.type,
        pricePerNight: Number(room.pricePerNight),
        status: room.status,
      };
    },

    async save(room: Room) {
      const [model, created] = await RoomModel.upsert(room, { returning: true });
      return {
        id: model.id,
        number: model.number,
        type: model.type,
        pricePerNight: Number(model.pricePerNight),
        status: model.status,
      };
    },

    async delete(id: string) {
      const room = await RoomModel.findByPk(id);
      if (!room) return false;
      await room.destroy();
      return true;
    },
  };
}
