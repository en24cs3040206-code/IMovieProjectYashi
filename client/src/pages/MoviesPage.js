import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

const GENRES = ['All', 'Action', 'Drama', 'Sci-Fi', 'Adventure', 'Thriller', 'Comedy'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];

const MoviesPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialFilter = searchParams.get('filter');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // rating, duration, title
  const [statusFilter, setStatusFilter] = useState(
    initialFilter === 'upcoming' ? 'upcoming' : 'all'
  );

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await movieService.getAll();
      if (res.data && res.data.data) {
        setMovies(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies
    .filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === 'All' ||
        (movie.genre && movie.genre.includes(selectedGenre));

      const matchesLanguage =
        selectedLanguage === 'All' ||
        movie.language?.toLowerCase() === selectedLanguage.toLowerCase();

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'now'
          ? movie.isNowShowing !== false
          : movie.isNowShowing === false;

      return matchesSearch && matchesGenre && matchesLanguage && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="section" style={{ marginTop: '80px', minHeight: '80vh' }}>
      <div className="section-header">
        <h1 className="section-title">
          Explore <span>Movies</span>
        </h1>
        <div className="text-secondary small">
          Showing {filteredMovies.length} movies
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center mb-4">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, genre, director..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-control"
            style={{ width: 'auto', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Releases</option>
            <option value="now">Now Showing</option>
            <option value="upcoming">Coming Soon</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang === 'All' ? 'All Languages' : lang}
              </option>
            ))}
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by Rating</option>
            <option value="duration">Sort by Duration</option>
            <option value="title">Sort by Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Genre Chips */}
      <div className="filter-bar">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`filter-chip ${selectedGenre === g ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <h3>No movies found</h3>
          <p>Try clearing or changing your filters</p>
        </div>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
