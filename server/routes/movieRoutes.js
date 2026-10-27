const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getNowShowing,
  getUpcoming,
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/now-showing', getNowShowing);
router.get('/upcoming', getUpcoming);
router.get('/', getMovies);
router.get('/:id', getMovie);

// Admin routes
router.post('/', protect, authorize('admin'), createMovie);
router.put('/:id', protect, authorize('admin'), updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router;
