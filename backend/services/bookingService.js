const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const roomService = require('./roomService');

class BookingService {
  // Create new booking
  async createBooking(bookingData, userId) {
    try {
      // Verify room exists and get details
      const room = await Room.findOne({ _id: bookingData.roomId, isActive: true })
        .populate('hotelId');
      
      if (!room) {
        throw new Error('Room not found');
      }

      // Check room availability for the dates
      const availability = await roomService.checkRoomAvailability(
        bookingData.roomId,
        bookingData.checkIn,
        bookingData.checkOut
      );

      if (!availability.available) {
        throw new Error(availability.reason);
      }

      // Check room capacity
      if (room.capacity.adults < bookingData.guests.adults) {
        throw new Error('Room cannot accommodate the number of adults');
      }
      if (room.capacity.children < (bookingData.guests.children || 0)) {
        throw new Error('Room cannot accommodate the number of children');
      }

      // Calculate total amount
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const totalAmount = room.pricePerNight * numberOfNights;

      // Create booking
      const booking = new Booking({
        userId: userId,
        roomId: bookingData.roomId,
        hotelId: room.hotelId._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalAmount: totalAmount,
        specialRequests: bookingData.specialRequests,
        contactInfo: bookingData.contactInfo
      });

      await booking.save();
      
      // Populate booking details
      await booking.populate([
        { path: 'userId', select: 'name email phone' },
        { path: 'roomId', select: 'roomNumber type pricePerNight capacity amenities' },
        { path: 'hotelId', select: 'name location' }
      ]);

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Get booking by ID
  async getBookingById(bookingId, userId = null, isAdmin = false) {
    try {
      const query = { _id: bookingId };
      
      // Non-admin users can only view their own bookings
      if (!isAdmin && userId) {
        query.userId = userId;
      }

      const booking = await Booking.findOne(query)
        .populate('userId', 'name email phone')
        .populate('roomId', 'roomNumber type pricePerNight capacity amenities images')
        .populate('hotelId', 'name location amenities images');

      if (!booking) {
        throw new Error('Booking not found');
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Get user's bookings
  async getUserBookings(userId, page = 1, limit = 10, status = null) {
    try {
      const skip = (page - 1) * limit;
      const query = { userId: userId };

      if (status) {
        query.bookingStatus = status;
      }

      const bookings = await Booking.find(query)
        .populate('roomId', 'roomNumber type pricePerNight capacity amenities images')
        .populate('hotelId', 'name location images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Booking.countDocuments(query);

      return {
        bookings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBookings: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all bookings (admin only)
  async getAllBookings(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      // Apply filters
      if (filters.status) {
        query.bookingStatus = filters.status;
      }
      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }
      if (filters.hotelId) {
        query.hotelId = filters.hotelId;
      }
      if (filters.userId) {
        query.userId = filters.userId;
      }
      if (filters.checkInFrom || filters.checkInTo) {
        query.checkIn = {};
        if (filters.checkInFrom) query.checkIn['$gte'] = new Date(filters.checkInFrom);
        if (filters.checkInTo) query.checkIn['$lte'] = new Date(filters.checkInTo);
      }

      const bookings = await Booking.find(query)
        .populate('userId', 'name email phone')
        .populate('roomId', 'roomNumber type pricePerNight')
        .populate('hotelId', 'name location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Booking.countDocuments(query);

      return {
        bookings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBookings: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId, userId = null, isAdmin = false, reason = '') {
    try {
      const query = { _id: bookingId, bookingStatus: 'Confirmed' };
      
      // Non-admin users can only cancel their own bookings
      if (!isAdmin && userId) {
        query.userId = userId;
      }

      const booking = await Booking.findOne(query);
      if (!booking) {
        throw new Error('Booking not found or cannot be cancelled');
      }

      // Check if booking can be cancelled (e.g., not too close to check-in date)
      const now = new Date();
      const checkInDate = new Date(booking.checkIn);
      const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

      if (hoursUntilCheckIn < 24 && !isAdmin) {
        throw new Error('Cannot cancel booking less than 24 hours before check-in');
      }

      // Update booking status
      booking.bookingStatus = 'Cancelled';
      booking.cancellationDate = new Date();
      booking.cancellationReason = reason;
      
      await booking.save();

      // Populate booking details
      await booking.populate([
        { path: 'userId', select: 'name email phone' },
        { path: 'roomId', select: 'roomNumber type pricePerNight' },
        { path: 'hotelId', select: 'name location' }
      ]);

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status, userId = null, isAdmin = false) {
    try {
      const query = { _id: bookingId };
      
      // Non-admin users can only update their own bookings
      if (!isAdmin && userId) {
        query.userId = userId;
      }

      const validStatuses = ['Confirmed', 'Cancelled', 'Completed', 'No Show'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid booking status');
      }

      const booking = await Booking.findOneAndUpdate(
        query,
        { bookingStatus: status },
        { new: true, runValidators: true }
      ).populate([
        { path: 'userId', select: 'name email phone' },
        { path: 'roomId', select: 'roomNumber type pricePerNight' },
        { path: 'hotelId', select: 'name location' }
      ]);

      if (!booking) {
        throw new Error('Booking not found');
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(bookingId, paymentStatus, isAdmin = false) {
    try {
      if (!isAdmin) {
        throw new Error('Only admin can update payment status');
      }

      const validPaymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        throw new Error('Invalid payment status');
      }

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { paymentStatus: paymentStatus },
        { new: true, runValidators: true }
      ).populate([
        { path: 'userId', select: 'name email phone' },
        { path: 'roomId', select: 'roomNumber type pricePerNight' },
        { path: 'hotelId', select: 'name location' }
      ]);

      if (!booking) {
        throw new Error('Booking not found');
      }

      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Get booking statistics (admin only)
  async getBookingStats(hotelId = null) {
    try {
      const matchQuery = {};
      if (hotelId) {
        matchQuery.hotelId = hotelId;
      }

      const stats = await Booking.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            confirmedBookings: {
              $sum: { $cond: [{ $eq: ['$bookingStatus', 'Confirmed'] }, 1, 0] }
            },
            cancelledBookings: {
              $sum: { $cond: [{ $eq: ['$bookingStatus', 'Cancelled'] }, 1, 0] }
            },
            completedBookings: {
              $sum: { $cond: [{ $eq: ['$bookingStatus', 'Completed'] }, 1, 0] }
            },
            paidBookings: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalBookings: 0,
        totalRevenue: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        completedBookings: 0,
        paidBookings: 0
      };
    } catch (error) {
      throw error;
    }
  }

  // Get upcoming bookings
  async getUpcomingBookings(userId = null, isAdmin = false, days = 7) {
    try {
      const query = {
        bookingStatus: 'Confirmed',
        checkIn: {
          $gte: new Date(),
          $lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        }
      };

      if (!isAdmin && userId) {
        query.userId = userId;
      }

      const bookings = await Booking.find(query)
        .populate('userId', 'name email phone')
        .populate('roomId', 'roomNumber type')
        .populate('hotelId', 'name location')
        .sort({ checkIn: 1 });

      return bookings;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookingService();
