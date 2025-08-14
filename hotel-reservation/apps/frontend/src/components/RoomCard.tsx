import { Room } from "../types/Room";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>Room {room.number}</h3>
      <p>Type: {room.type}</p>
      <p>Price per night: ${room.pricePerNight}</p>
      <p>Status: {room.status}</p>
    </div>
  );
}
