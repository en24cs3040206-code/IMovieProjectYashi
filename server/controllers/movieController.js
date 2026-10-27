const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = { isActive: true };

    if (req.query.genre) {
      filter.genre = { $in: req.query.genre.split(',') };
    }
    if (req.query.language) {
      filter.language = req.query.language;
    }
    if (req.query.nowShowing !== undefined) {
      filter.isNowShowing = req.query.nowShowing === 'true';
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    if (req.query.certification) {
      filter.certification = req.query.certification;
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort;
      sort[sortField] = req.query.order === 'asc' ? 1 : -1;
    } else {
      sort = { releaseDate: -1 };
    }

    const movies = await Movie.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create movie
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully.',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully.',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (soft delete)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get now showing movies
// @route   GET /api/movies/now-showing
// @access  Public
exports.getNowShowing = async (req, res, next) => {
  try {
    const movies = await Movie.find({ isActive: true, isNowShowing: true })
      .sort({ releaseDate: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
// @access  Public
exports.getUpcoming = async (req, res, next) => {
  try {
    const movies = await Movie.find({
      isActive: true,
      releaseDate: { $gt: new Date() },
      isNowShowing: false,
    })
      .sort({ releaseDate: 1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};
