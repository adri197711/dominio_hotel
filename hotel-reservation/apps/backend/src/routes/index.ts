import { Router } from 'express';
import roomRoutes from './roomRoutes';
import reservationRoutes from './reservationRoutes';
import userRoutes from './userRoutes';

const router = Router();


router.use('/users', userRoutes);
router.use('/rooms', roomRoutes);
router.use('/reservations', reservationRoutes);

export default router;