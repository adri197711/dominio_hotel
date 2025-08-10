import { describe, it, expect, beforeEach } from 'vitest';
import { RoomRepository } from "../../../../domain/src/repositories/RoomRepository";
import { createInMemoryReservationRepository } from '../../../../domain/src/mocks/InMemoryReservationRepository';
import { createInMemoryRoomRepository } from '../../../../domain/src/mocks/InMemoryRoomRepository';
import { ReservationRepository } from "../../../../domain/src/repositories/ReservationRepository";
import { Reservation } from "../../../../domain/src/entities/Reservation";
import { Room } from "../../../../domain/src/entities/Room";
import { addReservationService, cancelReservationService, completeReservationService, updateReservationService } from '../services/reservationServices';

describe('Reservation Services', () => {
  let reservationRepo: ReservationRepository;
  let roomRepo: RoomRepository;
  let testRoomId: string;
  let testUserId: string;

  beforeEach(() => {
    reservationRepo = createInMemoryReservationRepository();
    roomRepo = createInMemoryRoomRepository();
    testRoomId = 'room-123';
    testUserId = 'user-123';
  });

  describe('Debug Tests', () => {
    it('should test repositories work correctly', async () => {
      console.log('=== TESTING REPOSITORIES ===');
      
      // Test room repository
      const testRoom: Room = {
        id: 'debug-room-123',
        number: '999',
        type: 'single',
        status: 'available',
        pricePerNight: 150
      };
      
      console.log('Saving room:', testRoom);
      await roomRepo.save(testRoom);
      
      const retrievedRoom = await roomRepo.findById('debug-room-123');
      console.log('Retrieved room:', retrievedRoom);
      expect(retrievedRoom).not.toBeNull();
      
      // Test reservation repository
      const testReservationData = {
        roomId: 'debug-room-123',
        userId: 'debug-user-123',
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03'),
        totalPrice: 300,
        status: 'pending' as const
      };
      
      console.log('Saving reservation:', testReservationData);
      const savedReservation = await reservationRepo.save(testReservationData);
      console.log('Saved reservation result:', savedReservation);
      
      expect(savedReservation).toBeDefined();
      expect(savedReservation.id).toBeDefined();
      
      // Test service integration
      console.log('Testing addReservationService...');
      const serviceReservationData = {
        roomId: 'debug-room-123',
        userId: 'debug-user-456',
        checkInDate: new Date('2025-02-01'),
        checkOutDate: new Date('2025-02-03')
      };
      
      try {
        const serviceResult = await addReservationService(
          serviceReservationData,
          reservationRepo,
          roomRepo
        );
        console.log('Service result:', serviceResult);
        expect(serviceResult).toBeDefined();
        expect(serviceResult.id).toBeDefined();
      } catch (error) {
        console.error('Service error:', error);
        throw error;
      }
    });
  });

  describe('addReservationService', () => {
    it('should create a new reservation successfully', async () => {
      const room: Room = {
        id: testRoomId,
        number: '101',
        type: 'single',
        status: 'available',
        pricePerNight: 100
      };
      await roomRepo.save(room);

      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03')
      };

      const newReservation = await addReservationService(
        reservationData,
        reservationRepo,
        roomRepo
      );

      expect(newReservation).toHaveProperty('id');
      expect(newReservation.userId).toBe(testUserId);
      expect(newReservation.roomId).toBe(testRoomId);
      expect(newReservation.status).toBe('pending');
      expect(newReservation.totalPrice).toBe(200);

      const updatedRoom = await roomRepo.findById(testRoomId);
      expect(updatedRoom?.status).toBe('booked');
    });

    it('should throw error for invalid dates', async () => {
      const room: Room = {
        id: testRoomId,
        number: '101',
        type: 'single',
        status: 'available',
        pricePerNight: 100
      };
      await roomRepo.save(room);

      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-03'),
        checkOutDate: new Date('2025-01-01')
      };

      await expect(
        addReservationService(reservationData, reservationRepo, roomRepo)
      ).rejects.toThrow('Check-out date must be after check-in date.');
    });

    it('should throw error for non-existent room', async () => {
      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03')
      };

      await expect(
        addReservationService(reservationData, reservationRepo, roomRepo)
      ).rejects.toThrow('Room not found.');
    });

    it('should throw error for unavailable room', async () => {
      const room: Room = {
        id: testRoomId,
        number: '101',
        type: 'single',
        status: 'booked', // Use 'booked' instead of 'occupied' - this is a valid RoomStatus
        pricePerNight: 100
      };
      await roomRepo.save(room);

      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03')
      };

      await expect(
        addReservationService(reservationData, reservationRepo, roomRepo)
      ).rejects.toThrow('Room is not available for the selected dates.');
    });
  });

  describe('cancelReservationService', () => {
    it('should cancel a reservation successfully', async () => {
      // Create room and reservation inline to avoid beforeEach issues
      const room: Room = {
        id: testRoomId,
        number: '101',
        type: 'single',
        status: 'available',
        pricePerNight: 100
      };
      await roomRepo.save(room);

      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03')
      };

      const createdReservation = await addReservationService(
        reservationData,
        reservationRepo,
        roomRepo
      );

      await cancelReservationService(
        createdReservation.id,
        reservationRepo,
        roomRepo
      );

      const reservation = await reservationRepo.findById(createdReservation.id);
      expect(reservation).toBeNull();

      const roomAfterCancel = await roomRepo.findById(testRoomId);
      expect(roomAfterCancel?.status).toBe('available');
    });

    it('should throw error for non-existent reservation', async () => {
      await expect(
        cancelReservationService('non-existent-id', reservationRepo, roomRepo)
      ).rejects.toThrow('Reservation not found.');
    });
  });

  describe('completeReservationService', () => {
    it('should complete a reservation successfully', async () => {
      // Create room and reservation inline to avoid beforeEach issues
      const room: Room = {
        id: testRoomId,
        number: '101',
        type: 'single',
        status: 'available',
        pricePerNight: 100
      };
      await roomRepo.save(room);

      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03')
      };

      const createdReservation = await addReservationService(
        reservationData,
        reservationRepo,
        roomRepo
      );

      await completeReservationService(
        createdReservation.id,
        reservationRepo,
        roomRepo
      );

      const reservation = await reservationRepo.findById(createdReservation.id);
      expect(reservation).toBeNull();

      const roomAfterComplete = await roomRepo.findById(testRoomId);
      expect(roomAfterComplete?.status).toBe('available');
    });

    it('should throw error for non-existent reservation', async () => {
      await expect(
        completeReservationService('non-existent-id', reservationRepo, roomRepo)
      ).rejects.toThrow('Reservation not found.');
    });
  });

  describe('updateReservationService', () => {
    it('should update a reservation successfully', async () => {
      // Create room and reservation inline to avoid beforeEach issues
      const room: Room = {
        id: testRoomId,
        number: '101',
        type: 'single',
        status: 'available',
        pricePerNight: 100
      };
      await roomRepo.save(room);

      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03')
      };

      const createdReservation = await addReservationService(
        reservationData,
        reservationRepo,
        roomRepo
      );

      const updateData = {
        id: createdReservation.id,
        checkOutDate: new Date('2025-01-05')
      };

      const updatedReservation = await updateReservationService(
        updateData,
        reservationRepo
      );

      expect(updatedReservation.id).toBe(createdReservation.id);
      expect(updatedReservation.checkOutDate).toEqual(updateData.checkOutDate);
    });

    it('should throw error for invalid dates', async () => {
      // Create room and reservation inline
      const room: Room = {
        id: testRoomId,
        number: '101',
        type: 'single',
        status: 'available',
        pricePerNight: 100
      };
      await roomRepo.save(room);

      const reservationData = {
        roomId: testRoomId,
        userId: testUserId,
        checkInDate: new Date('2025-01-01'),
        checkOutDate: new Date('2025-01-03')
      };

      const createdReservation = await addReservationService(
        reservationData,
        reservationRepo,
        roomRepo
      );

      const updateData = {
        id: createdReservation.id,
        checkInDate: new Date('2025-01-05'),
        checkOutDate: new Date('2025-01-03')
      };

      await expect(
        updateReservationService(updateData, reservationRepo)
      ).rejects.toThrow('Check-out date must be after check-in date.');
    });

    it('should throw error for non-existent reservation', async () => {
      const updateData = {
        id: 'non-existent-id',
        checkOutDate: new Date('2025-01-05')
      };

      await expect(
        updateReservationService(updateData, reservationRepo)
      ).rejects.toThrow('Reservation not found.');
    });
  });
});