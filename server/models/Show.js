const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
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
    screenNumber: {
      type: Number,
      required: [true, 'Screen number is required'],
    },
    date: {
      type: Date,
      required: [true, 'Show date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    pricing: [
      {
        category: {
          type: String,
          enum: ['Silver', 'Gold', 'Platinum', 'Diamond', 'Recliner'],
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    bookedSeats: [
      {
        type: String, // e.g., "A1", "B5", "C10"
      },
    ],
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for show filtering
showSchema.index({ movie: 1, date: 1 });
showSchema.index({ theatre: 1, date: 1 });
showSchema.index({ date: 1, isActive: 1 });
showSchema.index({ theatre: 1, screenNumber: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Show', showSchema);
