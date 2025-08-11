import { Router } from 'express';
import { createReservationController } from '../controllers/reservationController';
import { ReservationService } from '../services/reservationServices';

export function createReservationRoutes(deps: {
  reservationService: ReservationService;
}) {
  const router = Router();
  const reservationController = createReservationController(deps);

  // CRUD endpoints
  router.post('/', reservationController.createReservation);
  router.get('/:id', reservationController.getReservationById);
  router.delete('/:id', reservationController.deleteReservation);
  
  router.put('/:id/complete', reservationController.completeReservation);
  router.put('/:id/cancel', reservationController.cancelReservation);
  router.get('/', reservationController.getAllReservations);

  return router;
}