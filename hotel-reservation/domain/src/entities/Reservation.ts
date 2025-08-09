export type ReservationStatus = 'pending' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: ReservationStatus;
}
