export type RoomType = 'single' | 'double' | 'suite';
export type RoomStatus = 'available' | 'booked';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  pricePerNight: number;
  status: RoomStatus;
}
