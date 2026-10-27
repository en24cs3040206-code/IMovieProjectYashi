import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaTicketAlt } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    navigate(`/movies/${movie._id}`);
  };

  // Fallback poster if broken
  const defaultPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-card-poster">
        <img
          src={movie.poster || defaultPoster}
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultPoster;
          }}
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <button className="btn btn-primary btn-sm" onClick={handleBookClick}>
            <FaTicketAlt /> Book Tickets
          </button>
        </div>
      </div>

      <div className="movie-card-info">
        <h3 className="movie-card-title" title={movie.title}>
          {movie.title}
        </h3>

        <div className="movie-card-meta mb-2">
          <span className="movie-rating">
            <FaStar className="star" /> {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
          </span>
          <span>•</span>
          <span>{movie.duration ? `${movie.duration}m` : '2h'}</span>
          <span>•</span>
          <span className="certification-badge">{movie.certification || 'UA'}</span>
        </div>

        <div className="d-flex flex-wrap gap-1">
          {movie.genre &&
            movie.genre.slice(0, 2).map((g, index) => (
              <span key={index} className="genre-tag">
                {g}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
