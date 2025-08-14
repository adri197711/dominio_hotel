import { Reservation } from '../entities/Reservation';
import { mockReservationPending, mockReservationCompleted } from '../stories/fixtures';

export const ReservationsService = {
  getAll: async (): Promise<Reservation[]> => [mockReservationPending, mockReservationCompleted],
  getById: async (id: string): Promise<Reservation | null> => {
    if (id === mockReservationPending.id) return mockReservationPending;
    if (id === mockReservationCompleted.id) return mockReservationCompleted;
    return null;
  }
};
