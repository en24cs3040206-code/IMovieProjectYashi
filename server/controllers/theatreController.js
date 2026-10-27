const Theatre = require('../models/Theatre');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    let filter = { isActive: true };

    if (req.query.city) {
      filter['location.city'] = new RegExp(req.query.city, 'i');
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const theatres = await Theatre.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create theatre
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully.',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully.',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre (soft delete)
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
