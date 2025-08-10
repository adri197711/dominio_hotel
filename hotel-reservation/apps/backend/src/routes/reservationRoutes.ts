import { Router, Request, Response } from 'express';
import { reservationController } from '../controllers/reservationController';

const router = Router();

// CRUD endpoints
router.post('/', reservationController.create);
router.get('/:id', reservationController.findById);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.delete);

// Operaciones específicas de reservaciones
router.put('/:id/complete', reservationController.complete);
router.put('/:id/cancel', reservationController.cancel);

export default router;