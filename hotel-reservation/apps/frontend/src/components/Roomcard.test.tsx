import { render, screen } from '@testing-library/react';
import { RoomCard } from './RoomCard';
import { Room } from '../types/Room';

test("muestra número y tipo de habitación", () => {
  const room: Room = { id: "1", number: "101", type: "single", pricePerNight: 100, status: "available" };
  render(<RoomCard room={room} />);
  expect(screen.getByText(/101/)).toBeInTheDocument();
  expect(screen.getByText(/single/i)).toBeInTheDocument();
});