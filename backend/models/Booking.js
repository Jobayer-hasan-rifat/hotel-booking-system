const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Check-in date cannot be in the past'
    }
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(value) {
        return value > this.checkIn;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  guests: {
    adults: {
      type: Number,
      required: [true, 'Number of adults is required'],
      min: [1, 'At least one adult is required']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Number of children cannot be negative']
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  bookingStatus: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed', 'No Show'],
    default: 'Confirmed'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required']
    }
  },
  cancellationDate: {
    type: Date
  },
  cancellationReason: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate number of nights
bookingSchema.virtual('numberOfNights').get(function() {
  const diffTime = Math.abs(this.checkOut - this.checkIn);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });

// Indexes for efficient queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ hotelId: 1, bookingStatus: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
