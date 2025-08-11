import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { createReservationRoutes } from './routes/reservationRoutes';
import { createRoomRoutes } from './routes/roomRoutes';
import { createUserRoutes } from './routes/userRoutes';

import { createReservationService } from './services/reservationServices';
import { createRoomService } from './services/roomServices';
import { userService } from './services/userServices';

import { createReservationRepository } from './repositories/reservationRepository';
import { createRoomRepository } from './repositories/roomRepository';
import { createUserRepository } from './repositories/userRepository';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  
  const repositories = {
    reservationRepository: createReservationRepository(),
    roomRepository: createRoomRepository(),
    userRepository: createUserRepository()
  };

  const reservationService = createReservationService(repositories.reservationRepository);
  const roomService = createRoomService(repositories.roomRepository);
  
  const reservationRouter = createReservationRoutes({ reservationService });
  const roomRouter = createRoomRoutes({ roomService });
  const userRouter = createUserRoutes({
    registerUserService: userService(),
    loginUserService: userService(),
    getAllUsersService: userService(),
    getUserByIdService: userService(),
    updateUserService: userService(),
    deleteUserService: userService(),
  });

  app.use('/api/users', userRouter);
  app.use('/api/rooms', roomRouter);
  app.use('/api/reservations', reservationRouter);

  app.get('/', (_req, res) => {
    res.json({ 
      message: 'Hotel Reservation API running...',
      version: '1.0.0',
      endpoints: {
        users: '/api/users',
        rooms: '/api/rooms', 
        reservations: '/api/reservations'
      }
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  return app;
}