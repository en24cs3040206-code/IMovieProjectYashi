import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaPlay, FaTicketAlt, FaFilm, FaStar, FaVolumeUp, FaBolt, FaShieldAlt } from 'react-icons/fa';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Thriller', 'Comedy'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];

const HomePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await movieService.getAll();
      if (res.data && res.data.data) {
        const fetchedMovies = res.data.data;
        setMovies(fetchedMovies);
        if (fetchedMovies.length > 0) {
          // Set first now showing or top rated as featured
          const featured = fetchedMovies.find((m) => m.isNowShowing) || fetchedMovies[0];
          setFeaturedMovie(featured);
        }
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === 'All' ||
      (movie.genre && movie.genre.includes(selectedGenre));

    const matchesLanguage =
      selectedLanguage === 'All' ||
      movie.language?.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesGenre && matchesLanguage;
  });

  const nowShowingMovies = filteredMovies.filter((m) => m.isNowShowing !== false);
  const upcomingMovies = filteredMovies.filter((m) => m.isNowShowing === false);

  return (
    <div>
      {/* Hero Section */}
      {featuredMovie && (
        <section className="hero">
          <div className="hero-bg">
            <img
              src={featuredMovie.banner || featuredMovie.poster}
              alt={featuredMovie.title}
            />
          </div>

          <div className="hero-content">
            <div className="hero-tag">
              <FaFilm /> NOW SHOWING IN CINEMAS
            </div>

            <h1 className="hero-title">
              {featuredMovie.title.split(' ')[0]} <span>{featuredMovie.title.split(' ').slice(1).join(' ')}</span>
            </h1>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="movie-rating" style={{ fontSize: '1.1rem' }}>
                <FaStar /> {featuredMovie.rating ? featuredMovie.rating.toFixed(1) : '8.8'} / 10
              </span>
              <span className="text-secondary">•</span>
              <span className="text-secondary">{featuredMovie.duration} Mins</span>
              <span className="text-secondary">•</span>
              <span className="certification-badge">{featuredMovie.certification || 'UA 16+'}</span>
              <span className="text-secondary">•</span>
              <span className="text-warning font-weight-bold">{featuredMovie.language}</span>
            </div>

            <p className="hero-description">{featuredMovie.description}</p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate(`/movies/${featuredMovie._id}`)}
              >
                <FaTicketAlt /> Book Tickets
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate(`/movies/${featuredMovie._id}`)}
              >
                <FaPlay /> Watch Trailer
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Screens Nationwide</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4K</div>
                <div className="hero-stat-label">Laser Projection</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">Dolby</div>
                <div className="hero-stat-label">Atmos Surround</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Real-time Booking</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Section */}
      <div className="section">
        {/* Search Bar & Filters */}
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center mb-4">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search movies by title, director, or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2 flex-wrap">
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
          </div>
        </div>

        {/* Genre Chips */}
        <div className="filter-bar">
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`filter-chip ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Now Showing Section */}
        <div className="mb-5">
          <div className="section-header">
            <h2 className="section-title">
              Now <span>Showing</span>
            </h2>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              Showing {nowShowingMovies.length} movies
            </span>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : nowShowingMovies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎬</div>
              <h3>No movies found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="movie-grid">
              {nowShowingMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        {upcomingMovies.length > 0 && (
          <div className="mb-5">
            <div className="section-header">
              <h2 className="section-title">
                Coming <span>Soon</span>
              </h2>
            </div>
            <div className="movie-grid">
              {upcomingMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Features Showcase Banner */}
        <div
          className="mt-5 p-4 p-md-5 rounded-4"
          style={{
            background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(26, 26, 46, 0.9) 100%)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div className="row g-4 align-items-center">
            <div className="col-md-3 text-center text-md-start">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', background: 'rgba(229, 9, 20, 0.2)', color: 'var(--primary)' }}
              >
                <FaVolumeUp size={24} />
              </div>
              <h5>Dolby Atmos</h5>
              <p className="text-secondary small mb-0">Immersive multi-dimensional sound experience</p>
            </div>
            <div className="col-md-3 text-center text-md-start">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', background: 'rgba(245, 197, 24, 0.2)', color: 'var(--accent)' }}
              >
                <FaBolt size={24} />
              </div>
              <h5>Instant E-Tickets</h5>
              <p className="text-secondary small mb-0">Direct QR code entry on your phone, zero queues</p>
            </div>
            <div className="col-md-3 text-center text-md-start">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', background: 'rgba(33, 150, 243, 0.2)', color: 'var(--info)' }}
              >
                <FaFilm size={24} />
              </div>
              <h5>IMAX with Laser</h5>
              <p className="text-secondary small mb-0">Crystal clear images with razor-sharp contrast</p>
            </div>
            <div className="col-md-3 text-center text-md-start">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', background: 'rgba(0, 200, 83, 0.2)', color: 'var(--success)' }}
              >
                <FaShieldAlt size={24} />
              </div>
              <h5>Easy Cancellation</h5>
              <p className="text-secondary small mb-0">Instant refund to wallet or source account up to 2h prior</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
