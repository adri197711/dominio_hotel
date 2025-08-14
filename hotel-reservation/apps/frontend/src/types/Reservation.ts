export type ReservationStatus = 'pending' | 'completed' | 'cancelled' | 'available';

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice?: number;
  status: ReservationStatus;
}
