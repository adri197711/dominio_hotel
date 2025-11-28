import "@testing-library/jest-dom"; 
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from "vitest";
import { RoomCard } from './RoomCard';
import { Room } from '../types/Room';


describe("RoomCard", () => {
  test("muestra número y tipo de habitación", () => {
    const room: Room = { id: "1", number: "101", type: "single", pricePerNight: 100, status: "Available" };
    render(<RoomCard room={room} />);
    expect(screen.getByText(/Room 101/i)).toBeInTheDocument();

  });
});