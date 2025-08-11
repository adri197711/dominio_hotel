import { Request, Response } from "express";
import { ReservationService } from "../services/reservationServices";

export function createReservationController(deps: {
  reservationService: ReservationService;
}) {
  const { reservationService } = deps;

  return {
    createReservation: async (req: Request, res: Response) => {
      try {
        const reservation = await reservationService.createReservation(req.body);
        res.status(201).json(reservation);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },

    cancelReservation: async (req: Request, res: Response) => {
      try {
        await reservationService.cancelReservation(req.params.id);
        res.status(204).send();
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },

    completeReservation: async (req: Request, res: Response) => {
      try {
        await reservationService.completeReservation(req.params.id);
        res.status(204).send();
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },

    getReservationById: async (req: Request, res: Response) => {
      try {
        const reservation = await reservationService.getReservationById(req.params.id);
        if (!reservation) {
          return res.status(404).json({ message: "Reservation not found" });
        }
        res.json(reservation);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    getAllReservations: async (_req: Request, res: Response) => {
      try {
        const reservations = await reservationService.getAllReservations();
        res.json(reservations);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    deleteReservation: async (req: Request, res: Response) => {
      try {
        await reservationService.deleteReservation(req.params.id);
        res.status(204).send();
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },
  };
}