const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Show reference is required'],
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
    },
    seats: [
      {
        seatNumber: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          enum: ['Silver', 'Gold', 'Platinum', 'Diamond', 'Recliner'],
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    convenienceFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'expired', 'refunded'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    showDate: {
      type: Date,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      unique: true,
    },
    cancellationReason: String,
    cancelledAt: Date,
    refundAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique booking ID before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingId = `IMV-${timestamp}-${random}`;
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ show: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
