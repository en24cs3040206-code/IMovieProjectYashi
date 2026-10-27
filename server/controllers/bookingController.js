const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Movie = require('../models/Movie');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, paymentMethod } = req.body;

    // Get show details
    const show = await Show.findById(showId)
      .populate('movie', 'title')
      .populate('theatre', 'name');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    if (!show.isActive || show.isCancelled) {
      return res.status(400).json({ success: false, message: 'This show is no longer available.' });
    }

    // Check seat availability
    const requestedSeatNumbers = seats.map((s) => s.seatNumber);
    const alreadyBooked = requestedSeatNumbers.filter((seat) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${alreadyBooked.join(', ')} are already booked.`,
      });
    }

    // Calculate amounts
    let totalAmount = 0;
    const seatDetails = seats.map((seat) => {
      const pricing = show.pricing.find((p) => p.category === seat.category);
      const price = pricing ? pricing.price : 0;
      totalAmount += price;
      return {
        seatNumber: seat.seatNumber,
        category: seat.category,
        price,
      };
    });

    const convenienceFee = Math.round(totalAmount * 0.015); // 1.5% convenience fee
    const tax = Math.round((totalAmount + convenienceFee) * 0.18); // 18% GST
    const finalAmount = totalAmount + convenienceFee + tax;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      movie: show.movie._id,
      theatre: show.theatre._id,
      seats: seatDetails,
      totalAmount,
      convenienceFee,
      tax,
      finalAmount,
      status: 'confirmed',
      showDate: show.date,
      showTime: show.startTime,
    });

    // Update show's booked seats
    show.bookedSeats.push(...requestedSeatNumbers);
    show.availableSeats -= requestedSeatNumbers.length;
    await show.save();

    // Increment movie booking count
    await Movie.findByIdAndUpdate(show.movie._id, {
      $inc: { totalBookings: 1 },
    });

    // Create payment record
    await Payment.create({
      booking: booking._id,
      user: req.user.id,
      amount: finalAmount,
      method: paymentMethod || 'credit_card',
      status: 'completed',
      paidAt: new Date(),
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Booking Confirmed!',
      message: `Your booking for "${show.movie.title}" on ${new Date(show.date).toLocaleDateString()} at ${show.startTime} has been confirmed. Booking ID: ${booking.bookingId}`,
      type: 'booking',
      metadata: { bookingId: booking._id, movieId: show.movie._id },
    });

    // Populate booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster duration language')
      .populate('theatre', 'name location')
      .populate('show', 'startTime endTime screenNumber date');

    // Emit socket event for real-time seat update
    if (req.io) {
      req.io.to(`show-${showId}`).emit('seatsUpdated', {
        showId,
        bookedSeats: show.bookedSeats,
        availableSeats: show.availableSeats,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let filter = { user: req.user.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Upcoming vs Past
    if (req.query.type === 'upcoming') {
      filter.showDate = { $gte: new Date() };
      filter.status = 'confirmed';
    } else if (req.query.type === 'past') {
      filter.showDate = { $lt: new Date() };
    }

    const bookings = await Booking.find(filter)
      .populate('movie', 'title poster duration language genre certification')
      .populate('theatre', 'name location')
      .populate('show', 'startTime endTime screenNumber date')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster duration language genre certification director rating')
      .populate('theatre', 'name location screens amenities')
      .populate('show', 'startTime endTime screenNumber date pricing');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title')
      .populate('show', 'startTime date');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // Check if show hasn't started yet
    const showDateTime = new Date(booking.showDate);
    if (showDateTime < new Date()) {
      return res.status(400).json({ success: false, message: 'Cannot cancel past bookings.' });
    }

    // Calculate refund (full refund if > 4 hours before, 50% if 2-4 hours, no refund < 2 hours)
    const hoursUntilShow = (showDateTime - new Date()) / (1000 * 60 * 60);
    let refundPercentage = 0;
    if (hoursUntilShow > 4) refundPercentage = 100;
    else if (hoursUntilShow > 2) refundPercentage = 50;

    const refundAmount = Math.round(booking.finalAmount * (refundPercentage / 100));

    // Update booking
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    booking.cancelledAt = new Date();
    booking.refundAmount = refundAmount;
    await booking.save();

    // Release seats from show
    const show = await Show.findById(booking.show);
    if (show) {
      const seatNumbers = booking.seats.map((s) => s.seatNumber);
      show.bookedSeats = show.bookedSeats.filter((s) => !seatNumbers.includes(s));
      show.availableSeats += seatNumbers.length;
      await show.save();

      // Emit socket event
      if (req.io) {
        req.io.to(`show-${show._id}`).emit('seatsUpdated', {
          showId: show._id,
          bookedSeats: show.bookedSeats,
          availableSeats: show.availableSeats,
        });
      }
    }

    // Update payment
    if (refundAmount > 0) {
      await Payment.findOneAndUpdate(
        { booking: booking._id },
        { status: 'refunded', refundedAt: new Date(), refundAmount }
      );
    }

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Booking Cancelled',
      message: `Your booking for "${booking.movie.title}" has been cancelled. Refund of ₹${refundAmount} will be processed within 5-7 business days.`,
      type: 'cancellation',
      metadata: { bookingId: booking._id },
    });

    res.status(200).json({
      success: true,
      message: `Booking cancelled. Refund of ₹${refundAmount} (${refundPercentage}%) will be processed.`,
      data: { refundAmount, refundPercentage },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('movie', 'title poster')
      .populate('theatre', 'name location')
      .populate('show', 'startTime date screenNumber')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    // Revenue stats
    const stats = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalAmount' },
          totalBookings: { $sum: 1 },
          avgBookingValue: { $avg: '$finalAmount' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      stats: stats[0] || { totalRevenue: 0, totalBookings: 0, avgBookingValue: 0 },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};
