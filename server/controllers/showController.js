const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

// @desc    Get shows for a movie
// @route   GET /api/shows/movie/:movieId
// @access  Public
exports.getShowsByMovie = async (req, res, next) => {
  try {
    let filter = {
      movie: req.params.movieId,
      isActive: true,
      isCancelled: false,
    };

    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: date, $lt: nextDay };
    } else {
      // Default: shows from today onwards
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    }

    if (req.query.city) {
      const theatresInCity = await Theatre.find({
        'location.city': new RegExp(req.query.city, 'i'),
        isActive: true,
      }).select('_id');
      filter.theatre = { $in: theatresInCity.map((t) => t._id) };
    }

    const shows = await Show.find(filter)
      .populate('movie', 'title poster duration genre language certification')
      .populate('theatre', 'name location screens amenities')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show by ID (with seat availability)
// @route   GET /api/shows/:id
// @access  Public
exports.getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title poster duration genre language certification rating')
      .populate('theatre', 'name location screens amenities');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found.',
      });
    }

    // Get seat layout from theatre screen
    const theatre = show.theatre;
    const screen = theatre.screens.find((s) => s.screenNumber === show.screenNumber);

    res.status(200).json({
      success: true,
      data: {
        show,
        seatLayout: screen ? screen.seatLayout : null,
        screenType: screen ? screen.screenType : 'Standard',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows for a theatre
// @route   GET /api/shows/theatre/:theatreId
// @access  Public
exports.getShowsByTheatre = async (req, res, next) => {
  try {
    let filter = {
      theatre: req.params.theatreId,
      isActive: true,
      isCancelled: false,
    };

    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: date, $lt: nextDay };
    }

    const shows = await Show.find(filter)
      .populate('movie', 'title poster duration genre language certification')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create show
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const { movie, theatre, screenNumber, date, startTime, endTime, pricing } = req.body;

    // Get theatre details
    const theatreDoc = await Theatre.findById(theatre);
    if (!theatreDoc) {
      return res.status(404).json({ success: false, message: 'Theatre not found.' });
    }

    const screen = theatreDoc.screens.find((s) => s.screenNumber === screenNumber);
    if (!screen) {
      return res.status(400).json({ success: false, message: 'Screen not found in theatre.' });
    }

    const show = await Show.create({
      movie,
      theatre,
      screenNumber,
      date,
      startTime,
      endTime,
      pricing,
      totalSeats: screen.totalSeats,
      availableSeats: screen.totalSeats,
      bookedSeats: [],
    });

    const populatedShow = await Show.findById(show._id)
      .populate('movie', 'title poster duration')
      .populate('theatre', 'name location');

    res.status(201).json({
      success: true,
      message: 'Show created successfully.',
      data: populatedShow,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('movie', 'title poster duration')
      .populate('theatre', 'name location');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Show updated successfully.',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.cancelShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { isCancelled: true, isActive: false },
      { new: true }
    );

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Show cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all shows (Admin)
// @route   GET /api/shows
// @access  Private/Admin
exports.getAllShows = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const shows = await Show.find()
      .populate('movie', 'title poster duration language')
      .populate('theatre', 'name location')
      .sort({ date: -1, startTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Show.countDocuments();

    res.status(200).json({
      success: true,
      data: shows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};
