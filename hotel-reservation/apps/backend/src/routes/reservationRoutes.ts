import { Router } from 'express';
import {
  addReservationController,
  updateReservationController,
  deleteReservationController,
} from '../controllers/reservationController';

const router = Router();

router.post('/', addReservationController);

router.put('/', updateReservationController);

router.delete('/', deleteReservationController);

export default router;