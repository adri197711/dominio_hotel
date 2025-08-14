

import { Reservation } from '../types/reservation';

import { Room } from '../types/Room';
import { User } from '../types/User';

export const mockRoomAvailable: Room = {
  id: 'room1',
  number: '101',
  type: 'single',
  pricePerNight: 100,
  status: 'available',
};

export const mockRoomBooked: Room = {
  id: 'room2',
  number: '102',
  type: 'double',
  pricePerNight: 150,
  status: 'booked',
};


export const mockUserGuest: User = {
  id: 'user1',
  name: 'Juan Pérez',
  email: 'juan@example.com',
  password: '123456',
  role: 'guest',
};

export const mockUserAdmin: User = {
  id: 'user2',
  name: 'Ana López',
  email: 'ana@example.com',
  password: '123456',
  role: 'admin',
};


export const mockReservationPending: Reservation = {
  id: 'res1',
  userId: mockUserGuest.id,
  roomId: mockRoomAvailable.id,
  checkInDate: new Date(),
  checkOutDate: new Date(),
  status: 'pending',
};
export const mockReservationCompleted: Reservation = {
  id: 'res2',
  userId: mockUserAdmin.id,
  roomId: mockRoomBooked.id,
  checkInDate: new Date('2025-08-10T14:00:00'),
  checkOutDate: new Date('2025-08-12T11:00:00'),
  status: 'completed',
};
