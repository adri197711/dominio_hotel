import { Router } from 'express';
import { createRoomController } from '../controllers/roomController';
import { RoomService } from '../services/roomServices';

export function createRoomRoutes(deps: {
  roomService: RoomService;
}) {
  const router = Router();
  const roomController = createRoomController(deps);

  router.post('/', roomController.createRoom);
  router.get('/', roomController.getAllRooms);
  router.get('/:id', roomController.getRoomById);
  router.put('/:id', roomController.updateRoom);
  router.delete('/:id', roomController.deleteRoom);

  return router;
}
