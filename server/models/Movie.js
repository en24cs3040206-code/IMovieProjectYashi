const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Movie duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    genre: [
      {
        type: String,
        enum: [
          'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
          'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
          'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Musical',
          'Biography', 'Family', 'War', 'History', 'Sport',
        ],
      },
    ],
    language: {
      type: String,
      required: [true, 'Language is required'],
      enum: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Punjabi', 'Other'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    certification: {
      type: String,
      enum: ['U', 'UA', 'A', 'S', 'G', 'PG', 'PG-13', 'R', 'NC-17'],
      default: 'UA',
    },
    poster: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    trailer: {
      type: String,
      default: '',
    },
    cast: [
      {
        name: String,
        role: String,
        image: String,
      },
    ],
    director: {
      type: String,
      required: [true, 'Director name is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNowShowing: {
      type: Boolean,
      default: true,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filter performance
movieSchema.index(
  { title: 'text', description: 'text' },
  { default_language: 'english', language_override: 'text_language' }
);
movieSchema.index({ genre: 1 });
movieSchema.index({ language: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ isActive: 1, isNowShowing: 1 });
movieSchema.index({ rating: -1 });

module.exports = mongoose.model('Movie', movieSchema);
