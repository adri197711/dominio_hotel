import { useEffect, useState } from "react";
import { RoomCard } from "../components/RoomCard";
import { Room } from "../types/Room";
import { RoomsService } from "../api/rooms";


export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    RoomsService.getAll()
      .then(setRooms)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading rooms...</p>;
  if (!rooms.length) return <p>No rooms found</p>;

  return (
    <div>
      <h1>Rooms</h1>
      {rooms.map(room => <RoomCard key={room.id} room={room} />)}
    </div>
  );
}
