import { Request, Response } from 'express';
import {
  CreateReservationDependencies,
  CompleteReservationDependencies,
  CancelReservationDependencies,
} from '../useCases/interfaces';
import {
  CreateReservation,
  CompleteReservation,
  CancelReservation,
} from '../useCases';

export const reservationController = {
  create: async (req: Request, res: Response) => {
    try {
      const { userId, roomId, checkInDate, checkOutDate } = req.body;
      
      const reservation = await CreateReservation(
        req.app.locals.dependencies,
        { userId, roomId, checkInDate, checkOutDate }
      );
      
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  findById: async (req: Request, res: Response) => {
    try {
      const reservation = await req.app.locals.dependencies.reservationRepository
        .findById(req.params.id);
      
      if (!reservation) {
        return res.status(404).json({ error: 'Reservación no encontrada' });
      }
      
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, checkInDate, checkOutDate } = req.body;
      
      const reservation = await req.app.locals.dependencies.reservationRepository
        .findById(id);
      
      if (!reservation) {
        return res.status(404).json({ error: 'Reservación no encontrada' });
      }
      
      reservation.status = status;
      reservation.checkInDate = checkInDate;
      reservation.checkOutDate = checkOutDate;
      
      await req.app.locals.dependencies.reservationRepository.update(reservation);
      res.json(reservation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await req.app.locals.dependencies.reservationRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  complete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await CompleteReservation(
        req.app.locals.dependencies,
        id
      );
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  cancel: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await CancelReservation(
        req.app.locals.dependencies,
        id
      );
      
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};