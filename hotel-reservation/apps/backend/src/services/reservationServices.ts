import { RoomRepository } from "../../../../domain/src/repositories/RoomRepository";
import { ReservationRepository } from "../../../../domain/src/repositories/ReservationRepository";
import { Reservation } from "../../../../domain/src/entities/Reservation";


interface AddReservationData {
    roomId: string;
    userId: string;
    checkInDate: Date;
    checkOutDate: Date;
}
export const addReservationService = async (
  data: AddReservationData,
  reservationRepo: ReservationRepository,
  roomRepo: RoomRepository
): Promise<Reservation> => {
  if (data.checkOutDate <= data.checkInDate) {
    throw new Error('Check-out date must be after check-in date.');
  }

  const room = await roomRepo.findById(data.roomId);
  if (!room) {
    throw new Error('Room not found.');
  }

  if (room.status !== 'available') {
    throw new Error('Room is not available for the selected dates.');
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((data.checkOutDate.getTime() - data.checkInDate.getTime()) / millisecondsPerDay);
  const totalPrice = room.pricePerNight * days;

  // Crear la reserva sin ID, para que el repositorio la genere
  const reservationData: Omit<Reservation, 'id'> = {
    ...data,
    totalPrice,
    status: 'pending'
  };

  // Guardar reserva y obtener la instancia con ID
  const newReservation = await reservationRepo.save(reservationData);

  // Actualizar estado de la habitación
  room.status = 'booked';
  await roomRepo.update(room);

  return newReservation;
};



export const cancelReservationService = async (
  id: string,
  reservationRepo: ReservationRepository,
  roomRepo: RoomRepository
): Promise<void> => {
  const reservation = await reservationRepo.findById(id);
  if (!reservation) {
    throw new Error('Reservation not found.');
  }

  await reservationRepo.delete(id);
  
  // Devolver la habitación a estado 'available'
  const room = await roomRepo.findById(reservation.roomId);
  if (room) {
    room.status = 'available';
    await roomRepo.update(room);
  }
};


export const completeReservationService = async (id: string, reservationRepo: ReservationRepository, roomRepo: RoomRepository): Promise<void> => {
    const reservation = await reservationRepo.findById(id);
    if (!reservation) {
        throw new Error('Reservation not found.');
    }

    // Aquí podrías implementar la lógica para marcar la reserva como "completada"
    // Por ahora, solo la eliminaremos y liberaremos la habitación
    await reservationRepo.delete(id);

    // Devolver la habitación a estado 'available'
    const room = await roomRepo.findById(reservation.roomId);
    if (room) {
        room.status = 'available';
        await roomRepo.update(room);
    }
};
interface UpdateReservationData {
    id: string;
    checkInDate?: Date;
    checkOutDate?: Date;
    totalPrice?: number;
}

export const updateReservationService = async (
    data: UpdateReservationData, 
    repo: ReservationRepository
): Promise<Reservation> => {
    if (!data.id) {
        throw new Error('Reservation ID is required to update a reservation.');
    }

    const existingReservation = await repo.findById(data.id);
    if (!existingReservation) {
        throw new Error('Reservation not found.');
    }

    // Validar que las fechas de check-in y check-out sean lógicas
    if (data.checkInDate && data.checkOutDate && data.checkOutDate <= data.checkInDate) {
        throw new Error('Check-out date must be after check-in date.');
    }

    const updatedReservation: Reservation = {
        ...existingReservation,
        ...data,
        // En un sistema real, el totalPrice se recalcularía aquí si las fechas cambian
    };

    await repo.update(updatedReservation);
    return updatedReservation;
};
