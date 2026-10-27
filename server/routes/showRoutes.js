const express = require('express');
const router = express.Router();
const {
  getShowsByMovie,
  getShow,
  getShowsByTheatre,
  createShow,
  updateShow,
  cancelShow,
  getAllShows,
} = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');

router.get('/movie/:movieId', getShowsByMovie);
router.get('/theatre/:theatreId', getShowsByTheatre);
router.get('/:id', getShow);
router.get('/', protect, authorize('admin'), getAllShows);
router.post('/', protect, authorize('admin'), createShow);
router.put('/:id', protect, authorize('admin'), updateShow);
router.delete('/:id', protect, authorize('admin'), cancelShow);

module.exports = router;
