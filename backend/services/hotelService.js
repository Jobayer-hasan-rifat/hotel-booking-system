const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

class HotelService {
  // Get all hotels with filters and pagination
  async getAllHotels(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = { isActive: true };

      // Apply filters
      if (filters.city) {
        query['location.city'] = new RegExp(filters.city, 'i');
      }
      if (filters.state) {
        query['location.state'] = new RegExp(filters.state, 'i');
      }
      if (filters.minPrice || filters.maxPrice) {
        query['priceRange.min'] = {};
        if (filters.minPrice) query['priceRange.min']['$gte'] = filters.minPrice;
        if (filters.maxPrice) query['priceRange.max'] = { $lte: filters.maxPrice };
      }
      if (filters.amenities && filters.amenities.length > 0) {
        query.amenities = { $in: filters.amenities };
      }
      if (filters.rating) {
        query['rating.average'] = { $gte: filters.rating };
      }

      const hotels = await Hotel.find(query)
        .populate('createdBy', 'name email')
        .sort({ 'rating.average': -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Hotel.countDocuments(query);

      return {
        hotels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalHotels: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get hotel by ID with rooms
  async getHotelById(hotelId) {
    try {
      const hotel = await Hotel.findOne({ _id: hotelId, isActive: true })
        .populate('createdBy', 'name email')
        .populate({
          path: 'rooms',
          match: { isActive: true },
          select: 'roomNumber type pricePerNight capacity amenities images isAvailable'
        });

      if (!hotel) {
        throw new Error('Hotel not found');
      }

      return hotel;
    } catch (error) {
      throw error;
    }
  }

  // Create new hotel
  async createHotel(hotelData, userId) {
    try {
      const hotel = new Hotel({
        ...hotelData,
        createdBy: userId
      });

      await hotel.save();
      await hotel.populate('createdBy', 'name email');

      return hotel;
    } catch (error) {
      throw error;
    }
  }

  // Update hotel
  async updateHotel(hotelId, updateData, userId, isAdmin = false) {
    try {
      const query = { _id: hotelId, isActive: true };
      
      // Non-admin users can only update their own hotels
      if (!isAdmin) {
        query.createdBy = userId;
      }

      const hotel = await Hotel.findOneAndUpdate(
        query,
        updateData,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      if (!hotel) {
        throw new Error('Hotel not found or you do not have permission to update it');
      }

      return hotel;
    } catch (error) {
      throw error;
    }
  }

  // Delete hotel (soft delete)
  async deleteHotel(hotelId, userId, isAdmin = false) {
    try {
      const query = { _id: hotelId, isActive: true };
      
      // Non-admin users can only delete their own hotels
      if (!isAdmin) {
        query.createdBy = userId;
      }

      const hotel = await Hotel.findOneAndUpdate(
        query,
        { isActive: false },
        { new: true }
      );

      if (!hotel) {
        throw new Error('Hotel not found or you do not have permission to delete it');
      }

      // Also deactivate all rooms in this hotel
      await Room.updateMany(
        { hotelId: hotelId },
        { isActive: false }
      );

      return { message: 'Hotel deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Search hotels by name or location
  async searchHotels(searchTerm, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const searchRegex = new RegExp(searchTerm, 'i');

      const query = {
        isActive: true,
        $or: [
          { name: searchRegex },
          { 'location.city': searchRegex },
          { 'location.state': searchRegex },
          { 'location.address': searchRegex },
          { description: searchRegex }
        ]
      };

      const hotels = await Hotel.find(query)
        .populate('createdBy', 'name email')
        .sort({ 'rating.average': -1 })
        .skip(skip)
        .limit(limit);

      const total = await Hotel.countDocuments(query);

      return {
        hotels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalHotels: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get hotels by user (for admin or hotel owners)
  async getHotelsByUser(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const hotels = await Hotel.find({ createdBy: userId })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Hotel.countDocuments({ createdBy: userId });

      return {
        hotels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalHotels: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update hotel rating
  async updateHotelRating(hotelId, newRating) {
    try {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }

      // Calculate new average rating
      const totalRatings = hotel.rating.count;
      const currentAverage = hotel.rating.average;
      const newAverage = ((currentAverage * totalRatings) + newRating) / (totalRatings + 1);

      hotel.rating.average = Math.round(newAverage * 10) / 10; // Round to 1 decimal
      hotel.rating.count = totalRatings + 1;

      await hotel.save();
      return hotel;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new HotelService();
