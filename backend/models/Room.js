const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Presidential']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    adults: {
      type: Number,
      required: [true, 'Adult capacity is required'],
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  amenities: [{
    type: String,
    enum: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Safe', 'Balcony', 'Sea View', 'City View', 'Jacuzzi', 'Kitchenette']
  }],
  images: [{
    url: String,
    alt: String
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  size: {
    type: Number, // in square feet
    min: [0, 'Size cannot be negative']
  },
  bedType: {
    type: String,
    enum: ['Single', 'Double', 'Queen', 'King', 'Twin Beds']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for hotel and room number uniqueness
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

// Index for filtering
roomSchema.index({ type: 1, pricePerNight: 1 });
roomSchema.index({ isAvailable: 1, isActive: 1 });

module.exports = mongoose.model('Room', roomSchema);
