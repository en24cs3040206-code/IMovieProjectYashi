import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService, showService } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { FaStar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaVideo, FaInfoCircle, FaTicketAlt } from 'react-icons/fa';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingShow } = useBooking();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [loadingShows, setLoadingShows] = useState(false);

  // Generate next 7 days for the date selector
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { dateStr, dayName, dayNum, month };
  });

  useEffect(() => {
    loadMovie();
  }, [id]);

  useEffect(() => {
    if (movie) {
      loadShows(selectedDate);
    }
  }, [movie, selectedDate]);

  const loadMovie = async () => {
    setLoading(true);
    try {
      const res = await movieService.getById(id);
      if (res.data && res.data.data) {
        setMovie(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadShows = async (dateStr) => {
    setLoadingShows(true);
    try {
      const res = await showService.getByMovie(id, { date: dateStr });
      if (res.data && res.data.data) {
        setShows(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load shows:', err);
    } finally {
      setLoadingShows(false);
    }
  };

  const handleSelectShow = (show) => {
    setBookingShow(movie, show.theatre, show);
    navigate(`/booking/${show._id}`);
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="empty-state" style={{ marginTop: '100px' }}>
        <div className="empty-state-icon">🎬</div>
        <h3>Movie not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  // Group shows by Theatre
  const theatreMap = {};
  shows.forEach((show) => {
    const theatreId = show.theatre?._id || 'unknown';
    if (!theatreMap[theatreId]) {
      theatreMap[theatreId] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    theatreMap[theatreId].shows.push(show);
  });

  return (
    <div>
      {/* Movie Details Hero Banner */}
      <section className="movie-detail-hero">
        <div className="movie-detail-bg">
          <img src={movie.banner || movie.poster} alt={movie.title} />
        </div>

        <div className="movie-detail-content">
          <div className="movie-detail-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>

          <div className="movie-detail-info">
            <h1>{movie.title}</h1>

            <div className="movie-meta-row">
              <span className="movie-rating" style={{ fontSize: '1.2rem' }}>
                <FaStar /> {movie.rating ? movie.rating.toFixed(1) : '8.5'}/10
              </span>
              <span className="movie-meta-item">
                <FaClock /> {movie.duration} mins
              </span>
              <span className="movie-meta-item">
                <FaVideo /> {movie.language}
              </span>
              <span className="certification-badge">{movie.certification || 'UA 16+'}</span>
            </div>

            <div className="movie-genres">
              {movie.genre?.map((g, index) => (
                <span key={index} className="genre-tag">
                  {g}
                </span>
              ))}
            </div>

            <p className="movie-description">{movie.description}</p>

            <div className="mb-2">
              <span className="text-muted small">Director: </span>
              <strong className="text-light">{movie.director || 'Acclaimed Director'}</strong>
            </div>

            {/* Cast list */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <span className="text-muted small d-block mb-2">Top Cast:</span>
                <div className="movie-cast">
                  {movie.cast.map((actor, idx) => (
                    <div key={idx} className="cast-item">
                      <div className="cast-avatar">
                        {actor.name ? actor.name.charAt(0) : 'A'}
                      </div>
                      <div className="cast-name">{actor.name}</div>
                      <div className="cast-role">{actor.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shows & Tickets Booking Section */}
      <div className="show-selection">
        <div className="section-header">
          <h2 className="section-title">
            Select <span>Showtime</span>
          </h2>
        </div>

        {/* Date Picker Bar */}
        <div className="date-picker">
          {dateOptions.map((opt) => (
            <div
              key={opt.dateStr}
              className={`date-chip ${selectedDate === opt.dateStr ? 'active' : ''}`}
              onClick={() => setSelectedDate(opt.dateStr)}
            >
              <div className="day-name">{opt.dayName}</div>
              <div className="day-num">{opt.dayNum}</div>
              <div className="month">{opt.month}</div>
            </div>
          ))}
        </div>

        {/* Theatres & Shows List */}
        {loadingShows ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : Object.keys(theatreMap).length === 0 ? (
          <div className="empty-state card p-5">
            <FaCalendarAlt size={48} className="text-muted mb-3 mx-auto" />
            <h3>No shows scheduled for this date</h3>
            <p className="text-muted">
              Please choose another date from the calendar above to see available screenings.
            </p>
          </div>
        ) : (
          <div className="theatre-shows-list">
            {Object.values(theatreMap).map(({ theatre, shows: tShows }) => (
              <div key={theatre?._id} className="theatre-show-card">
                <div className="theatre-show-header">
                  <div>
                    <h3 className="theatre-name">{theatre?.name || 'Grand Cinema Multiplex'}</h3>
                    <div className="theatre-location">
                      <FaMapMarkerAlt className="me-1" />
                      {theatre?.location?.address}, {theatre?.location?.city}
                    </div>
                  </div>

                  {theatre?.amenities && (
                    <div className="theatre-amenities d-none d-md-flex">
                      {theatre.amenities.map((amenity, i) => (
                        <span key={i} className="amenity-tag">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="show-times">
                  {tShows.map((show) => (
                    <button
                      key={show._id}
                      className="show-time-btn"
                      onClick={() => handleSelectShow(show)}
                    >
                      <span>{show.startTime}</span>
                      <span className="screen-type">{show.screenType || '4K Laser'}</span>
                      <span className="show-price-info">₹{show.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
