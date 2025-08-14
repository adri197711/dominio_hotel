import { Reservation } from "../types/Reservation";

interface Props {
  reservation: Reservation;
}

export function ReservationCard({ reservation }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>Reservation ID: {reservation.id}</h3>
      <p>Room ID: {reservation.roomId}</p>
      <p>User ID: {reservation.userId}</p>
      <p>Check-in: {reservation.checkInDate.toLocaleDateString()}</p>
      <p>Check-out: {reservation.checkOutDate.toLocaleDateString()}</p>
      {reservation.totalPrice && <p>Total Price: ${reservation.totalPrice}</p>}
      <p>Status: {reservation.status}</p>
    </div>
  );
}
