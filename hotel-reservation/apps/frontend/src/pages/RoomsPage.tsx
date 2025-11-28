import { useEffect, useState } from "react";
import { RoomsService } from "../api/rooms";
import { Room } from "../types/Room";
import { RoomCard } from "../components/RoomCard";
import { Spinner } from "../components/Spinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = () => {
    setLoading(true);
    setError(null);
    RoomsService.getAll()
      .then((data) => setRooms(data))
      .catch(() => setError("No se pudieron cargar las habitaciones"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRooms();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadRooms} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Habitaciones</h1>
      { }
      {rooms.length === 0 ? (
        <p className="text-gray-500">No hay habitaciones disponibles</p>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
