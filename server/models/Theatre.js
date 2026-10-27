const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      pincode: {
        type: String,
      },
    },
    screens: [
      {
        screenNumber: {
          type: Number,
          required: true,
        },
        screenName: {
          type: String,
          default: '',
        },
        screenType: {
          type: String,
          enum: ['Standard', 'IMAX', 'Dolby Atmos', '4DX', 'Premium', 'VIP'],
          default: 'Standard',
        },
        totalSeats: {
          type: Number,
          required: true,
        },
        seatLayout: {
          rows: { type: Number, required: true },
          columns: { type: Number, required: true },
          categories: [
            {
              name: {
                type: String,
                enum: ['Silver', 'Gold', 'Platinum', 'Diamond', 'Recliner'],
                required: true,
              },
              price: {
                type: Number,
                required: true,
              },
              rows: [Number],
            },
          ],
        },
      },
    ],
    amenities: [
      {
        type: String,
        enum: ['Parking', 'Food Court', 'Wheelchair Access', 'Dolby Sound', '3D', 'IMAX', 'Recliner Seats', 'Online Booking', 'M-Ticket'],
      },
    ],
    contactNumber: String,
    email: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

theatreSchema.index({ 'location.city': 1 });
theatreSchema.index({ isActive: 1 });
theatreSchema.index({ name: 'text', 'location.city': 'text' });

module.exports = mongoose.model('Theatre', theatreSchema);
