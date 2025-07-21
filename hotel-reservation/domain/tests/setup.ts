import { beforeEach } from 'vitest';
import { InMemoryUserRepository } from '../src/repositories/mocks/InMemoryUserRepository';
import { InMemoryRoomRepository } from '../src/repositories/mocks/InMemoryRoomRepository';
import { InMemoryReservationRepository } from '../src/repositories/mocks/InMemoryReservationRepository';

import { AuthService } from '../src/services/AuthService';
import { RegisterUser } from '../src/use-cases/RegisterUser';
import { CreateReservation } from '../src/use-cases/CreateReservation';

// Exportar instancias reutilizables para todos los tests
export let userRepository: InMemoryUserRepository;
export let roomRepository: InMemoryRoomRepository;
export let reservationRepository: InMemoryReservationRepository;
export let authService: AuthService;
export let registerUser: RegisterUser;
export let createReservation: CreateReservation;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
  roomRepository = new InMemoryRoomRepository();
  reservationRepository = new InMemoryReservationRepository();

  authService = new AuthService(userRepository);
  registerUser = new RegisterUser(authService);
  createReservation = new CreateReservation(reservationRepository, roomRepository);
});
