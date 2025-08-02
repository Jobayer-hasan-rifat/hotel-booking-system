const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

class RoomService {
  // Get all rooms with filters
  async getAllRooms(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = { isActive: true };

      // Apply filters
      if (filters.hotelId) {
        query.hotelId = filters.hotelId;
      }
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.minPrice || filters.maxPrice) {
        query.pricePerNight = {};
        if (filters.minPrice) query.pricePerNight['$gte'] = filters.minPrice;
        if (filters.maxPrice) query.pricePerNight['$lte'] = filters.maxPrice;
      }
      if (filters.isAvailable !== undefined) {
        query.isAvailable = filters.isAvailable;
      }
      if (filters.amenities && filters.amenities.length > 0) {
        query.amenities = { $in: filters.amenities };
      }

      const rooms = await Room.find(query)
        .populate('hotelId', 'name location rating')
        .sort({ pricePerNight: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Room.countDocuments(query);

      return {
        rooms,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRooms: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get room by ID
  async getRoomById(roomId) {
    try {
      const room = await Room.findOne({ _id: roomId, isActive: true })
        .populate('hotelId', 'name location rating amenities');

      if (!room) {
        throw new Error('Room not found');
      }

      return room;
    } catch (error) {
      throw error;
    }
  }

  // Create new room
  async createRoom(roomData) {
    try {
      // Verify hotel exists
      const hotel = await Hotel.findOne({ _id: roomData.hotelId, isActive: true });
      if (!hotel) {
        throw new Error('Hotel not found');
      }

      // Check if room number already exists in this hotel
      const existingRoom = await Room.findOne({
        hotelId: roomData.hotelId,
        roomNumber: roomData.roomNumber,
        isActive: true
      });

      if (existingRoom) {
        throw new Error('Room number already exists in this hotel');
      }

      const room = new Room(roomData);
      await room.save();

      // Add room to hotel's rooms array
      await Hotel.findByIdAndUpdate(
        roomData.hotelId,
        { $push: { rooms: room._id } }
      );

      // Update hotel price range if necessary
      await this.updateHotelPriceRange(roomData.hotelId);

      await room.populate('hotelId', 'name location rating');
      return room;
    } catch (error) {
      throw error;
    }
  }

  // Update room
  async updateRoom(roomId, updateData) {
    try {
      const room = await Room.findOneAndUpdate(
        { _id: roomId, isActive: true },
        updateData,
        { new: true, runValidators: true }
      ).populate('hotelId', 'name location rating');

      if (!room) {
        throw new Error('Room not found');
      }

      // Update hotel price range if price was changed
      if (updateData.pricePerNight) {
        await this.updateHotelPriceRange(room.hotelId._id);
      }

      return room;
    } catch (error) {
      throw error;
    }
  }

  // Delete room (soft delete)
  async deleteRoom(roomId) {
    try {
      const room = await Room.findOneAndUpdate(
        { _id: roomId, isActive: true },
        { isActive: false },
        { new: true }
      );

      if (!room) {
        throw new Error('Room not found');
      }

      // Remove room from hotel's rooms array
      await Hotel.findByIdAndUpdate(
        room.hotelId,
        { $pull: { rooms: roomId } }
      );

      // Update hotel price range
      await this.updateHotelPriceRange(room.hotelId);

      return { message: 'Room deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Check room availability for specific dates
  async checkRoomAvailability(roomId, checkIn, checkOut) {
    try {
      const room = await Room.findOne({ _id: roomId, isActive: true });
      if (!room) {
        throw new Error('Room not found');
      }

      if (!room.isAvailable) {
        return { available: false, reason: 'Room is not available' };
      }

      // Check for overlapping bookings
      const overlappingBookings = await Booking.find({
        roomId: roomId,
        bookingStatus: { $in: ['Confirmed'] },
        $or: [
          {
            checkIn: { $lte: checkIn },
            checkOut: { $gt: checkIn }
          },
          {
            checkIn: { $lt: checkOut },
            checkOut: { $gte: checkOut }
          },
          {
            checkIn: { $gte: checkIn },
            checkOut: { $lte: checkOut }
          }
        ]
      });

      if (overlappingBookings.length > 0) {
        return { 
          available: false, 
          reason: 'Room is already booked for the selected dates',
          conflictingBookings: overlappingBookings
        };
      }

      return { available: true };
    } catch (error) {
      throw error;
    }
  }

  // Get available rooms for specific dates and hotel
  async getAvailableRooms(hotelId, checkIn, checkOut, guests = {}) {
    try {
      const rooms = await Room.find({
        hotelId: hotelId,
        isActive: true,
        isAvailable: true
      }).populate('hotelId', 'name location');

      const availableRooms = [];

      for (const room of rooms) {
        // Check capacity
        if (guests.adults && room.capacity.adults < guests.adults) {
          continue;
        }
        if (guests.children && room.capacity.children < guests.children) {
          continue;
        }

        // Check availability for dates
        const availability = await this.checkRoomAvailability(room._id, checkIn, checkOut);
        if (availability.available) {
          availableRooms.push(room);
        }
      }

      return availableRooms;
    } catch (error) {
      throw error;
    }
  }

  // Update hotel price range based on room prices
  async updateHotelPriceRange(hotelId) {
    try {
      const rooms = await Room.find({ hotelId: hotelId, isActive: true });
      
      if (rooms.length === 0) {
        await Hotel.findByIdAndUpdate(hotelId, {
          'priceRange.min': 0,
          'priceRange.max': 0
        });
        return;
      }

      const prices = rooms.map(room => room.pricePerNight);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      await Hotel.findByIdAndUpdate(hotelId, {
        'priceRange.min': minPrice,
        'priceRange.max': maxPrice
      });
    } catch (error) {
      throw error;
    }
  }

  // Get rooms by hotel
  async getRoomsByHotel(hotelId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const rooms = await Room.find({ hotelId: hotelId, isActive: true })
        .sort({ roomNumber: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Room.countDocuments({ hotelId: hotelId, isActive: true });

      return {
        rooms,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRooms: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update room availability status
  async updateRoomAvailability(roomId, isAvailable) {
    try {
      const room = await Room.findOneAndUpdate(
        { _id: roomId, isActive: true },
        { isAvailable: isAvailable },
        { new: true }
      ).populate('hotelId', 'name location');

      if (!room) {
        throw new Error('Room not found');
      }

      return room;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RoomService();
