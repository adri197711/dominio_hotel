import { useEffect, useState } from "react";
import { ReservationsService } from "../api/reservations";
import { Reservation } from "../types/reservation";
import { Spinner } from "../components/Spinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = () => {
    setLoading(true);
    setError(null);
    ReservationsService.getAll()
      .then((data) => setReservations(data))
      .catch(() => setError("No se pudieron cargar las reservas"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadReservations} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reservas</h1>
      <ul className="space-y-2">
        {reservations.map((res) => (
          <li key={res.id} className="border p-3 rounded shadow-sm bg-white">
            Usuario: {res.userId} | Habitación: {res.roomId} | Estado: {res.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
