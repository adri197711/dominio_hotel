import { Request, Response } from 'express';

import { addReservationService, updateReservationService } from '../services/reservationServices';

export const addReservationController = async (req: Request, res: Response) => {
  try {
    const { roomId, userId, checkInDate, checkOutDate, totalPrice } = req.body;
    const newReservationId = await addReservationService(
      { roomId, userId, checkInDate: new Date(checkInDate), checkOutDate: new Date(checkOutDate), totalPrice },
      ReservationRepository
    );
    res.status(201).json({ message: 'Reservation created successfully', id: newReservationId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateReservationController = async (req: Request, res: Response) => {
  try {
    const { id, roomId, userId, checkInDate, checkOutDate, totalPrice } = req.body;
    const updateData: any = { id };
    if (roomId) updateData.roomId = roomId;
    if (userId) updateData.userId = userId;
    if (checkInDate) updateData.checkInDate = new Date(checkInDate);
    if (checkOutDate) updateData.checkOutDate = new Date(checkOutDate);
    if (totalPrice) updateData.totalPrice = totalPrice;

    await updateReservationService(updateData, reservationRepo);
    res.status(200).json({ message: 'Reservation updated successfully', id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteReservationController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await deleteReservationService({ id }, reservationRepo);
    res.status(200).json({ message: 'Reservation deleted successfully', id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};