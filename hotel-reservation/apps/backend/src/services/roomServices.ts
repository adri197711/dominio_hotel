

import { Room, RoomType } from "../../../../domain/src/entities/Room";
import { RoomRepository } from "../../../../domain/src/repositories/RoomRepository";


interface AddRoomData {
    number: string;
    type: RoomType;
    pricePerNight: number;
}

interface UpdateRoomData {
    id: string;
    number?: string;
    type?: RoomType;
    pricePerNight?: number;
}

export const addRoomservice = async (data: AddRoomData, repo: RoomRepository): Promise<Room> => {
    if (!data.number || !data.type || !data.pricePerNight) {
        throw new Error("All fields (number, type, pricePerNight) are required.");
    }
    const newRoom: Room = {
        id: "", // El repositorio generará el ID
        number: data.number,
        type: data.type,
        pricePerNight: data.pricePerNight,
        status: 'available'
    };
    await repo.save(newRoom);
    return newRoom;
};

export const updateRoomservice = async (data: UpdateRoomData, repo: RoomRepository): Promise<Room> => {
    if (!data.id) {
        throw new Error("Room ID is required to update a room.");
    }
    const existingRoom = await repo.findById(data.id);
    if (!existingRoom) {
        throw new Error("Room not found.");
    }
    const updatedRoom: Room = {
        ...existingRoom,
        ...data
    };
    await repo.update(updatedRoom);
    return updatedRoom;
};

export const deleteRoomservice = async (id: string, repo: RoomRepository): Promise<void> => {
    const existingRoom = await repo.findById(id);
    if (!existingRoom) {
        throw new Error("Room not found.");
    }
    await repo.delete(id);
};

export const getAllRoomsservice = async (repo: RoomRepository): Promise<Room[]> => {
    return repo.getAll();
};

export const getRoomByIdservice = async (id: string, repo: RoomRepository): Promise<Room | null> => {
    return repo.findById(id);
};