import { Request, Response } from "express";
import { RoomService } from "../services/roomServices";

export function createRoomController(deps: {
  roomService: RoomService;
}) {
  const { roomService } = deps;

  return {
    createRoom: async (req: Request, res: Response) => {
      try {
        const room = await roomService.createRoom(req.body);
        res.status(201).json(room);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },

    getAllRooms: async (_req: Request, res: Response) => {
      try {
        const rooms = await roomService.getAllRooms();
        res.json(rooms);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    getRoomById: async (req: Request, res: Response) => {
      try {
        const room = await roomService.getRoomById(req.params.id);
        if (!room) {
          return res.status(404).json({ message: "Room not found" });
        }
        res.json(room);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    updateRoom: async (req: Request, res: Response) => {
      try {
        const room = await roomService.updateRoom(req.params.id, req.body);
        res.json(room);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },

    deleteRoom: async (req: Request, res: Response) => {
      try {
        const success = await roomService.deleteRoom(req.params.id);
        if (!success) {
          return res.status(404).json({ message: "Room not found" });
        }
        res.status(204).send();
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },
  };
}
