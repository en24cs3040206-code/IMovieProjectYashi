const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getTheatre,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} = require('../controllers/theatreController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTheatres);
router.get('/:id', getTheatre);
router.post('/', protect, authorize('admin'), createTheatre);
router.put('/:id', protect, authorize('admin'), updateTheatre);
router.delete('/:id', protect, authorize('admin'), deleteTheatre);

module.exports = router;
