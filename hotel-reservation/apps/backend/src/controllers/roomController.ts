import { Request, Response } from "express";
import { RoomStatus, RoomType } from "../../../../domain/src/entities/Room";
import { addRoomService, updateRoomService, deleteRoomService } from "../services/roomServices";
import { createInMemoryRoomRepository } from "../database/models/InMemoryRoomRepository";

const roomRepo = createInMemoryRoomRepository();



export const addRoomController = async (req: Request, res: Response) => {
  try {
    const { number, type, pricePerNight } = req.body;

    const roomType = type.toLowerCase() as RoomType;

    const newRoomId = await addRoomService({ number, type: roomType, pricePerNight }, roomRepo);
    res.status(201).json({ message: "Room created successfully", id: newRoomId, number, type: roomType, pricePerNight });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateRoomController = async (req: Request, res: Response) => {
  try {
    const { id, number, type, pricePerNight, status } = req.body;
    
    const updateData: any = { id };
    if (number) updateData.number = number;
    if (type) updateData.type = type.toLowerCase() as RoomType;
    if (pricePerNight) updateData.pricePerNight = pricePerNight;
    if (status) updateData.status = status.toLowerCase() as RoomStatus;

    await updateRoomService(updateData, roomRepo);
    res.status(200).json({ message: "Room updated successfully", id, ...updateData });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteRoomController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // en vez de req.body
    await deleteRoomService({ id }, roomRepo);
    res.status(200).json({ message: "Room deleted successfully", id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
