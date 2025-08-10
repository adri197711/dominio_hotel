import { Router } from 'express';
import {
  addRoomController,
  updateRoomController,
  deleteRoomController,
} from '../controllers/roomController';

const router = Router();

router.post('/', addRoomController);

router.put('/', updateRoomController);

router.delete('/', deleteRoomController);

export default router;