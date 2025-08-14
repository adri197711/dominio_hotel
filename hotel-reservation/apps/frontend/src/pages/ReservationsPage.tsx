import { useEffect, useState } from "react";
import { ReservationCard } from "../components/ReservationCard";
import { Reservation } from "../types/Reservation";
import { ReservationsService } from "../api/reservations";

export function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReservationsService.getAll()
      .then(setReservations)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reservations...</p>;
  if (!reservations.length) return <p>No reservations found</p>;

  return (
    <div>
      <h1>Reservations</h1>
      {reservations.map(r => <ReservationCard key={r.id} reservation={r} />)}
    </div>
  );
}
