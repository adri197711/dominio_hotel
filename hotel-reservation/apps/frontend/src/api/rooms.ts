
import { mockRoomAvailable, mockRoomBooked } from '../stories/fixtures';
import { Room } from '../types/Room';

export const RoomsService = {
  getAll: async (): Promise<Room[]> => {
    // Retorna mocks para desarrollo
    return [mockRoomAvailable, mockRoomBooked];
  },
  getById: async (id: string): Promise<Room | null> => {
    if (id === mockRoomAvailable.id) return mockRoomAvailable;
    if (id === mockRoomBooked.id) return mockRoomBooked;
    return null;
  }
};
