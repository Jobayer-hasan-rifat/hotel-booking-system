const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
    maxlength: [100, 'Hotel name cannot exceed 100 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    url: String,
    alt: String
  }],
  amenities: [{
    type: String,
    enum: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'Pet Friendly', 'Business Center', 'Room Service']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  priceRange: {
    min: {
      type: Number,
      required: [true, 'Minimum price is required']
    },
    max: {
      type: Number,
      required: [true, 'Maximum price is required']
    }
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for location-based searches
hotelSchema.index({ 'location.city': 1, 'location.state': 1 });
hotelSchema.index({ 'priceRange.min': 1, 'priceRange.max': 1 });
hotelSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Hotel', hotelSchema);
