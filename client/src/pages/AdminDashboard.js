import React, { useState, useEffect } from 'react';
import { movieService, theatreService, showService, bookingService } from '../services/api';
import { toast } from 'react-toastify';
import { FaFilm, FaStore, FaCalendarAlt, FaTicketAlt, FaPlus, FaTrash, FaRupeeSign, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, movies, theatres, shows, bookings
  const [loading, setLoading] = useState(true);

  // Data states
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modal / Form state for Add Movie
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    duration: 120,
    genre: 'Action, Drama',
    language: 'English',
    rating: 8.5,
    certification: 'UA',
    poster: '',
    banner: '',
    director: '',
    isNowShowing: true,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [mRes, tRes, sRes, bRes] = await Promise.all([
        movieService.getAll().catch(() => ({ data: { data: [] } })),
        theatreService.getAll().catch(() => ({ data: { data: [] } })),
        showService.getAll().catch(() => ({ data: { data: [] } })),
        bookingService.getAllAdmin().catch(() => ({ data: { data: [] } })),
      ]);

      setMovies(mRes.data?.data || []);
      setTheatres(tRes.data?.data || []);
      setShows(sRes.data?.data || []);
      setBookings(bRes.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administrative records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMovie,
        duration: Number(newMovie.duration),
        rating: Number(newMovie.rating),
        genre: typeof newMovie.genre === 'string' ? newMovie.genre.split(',').map((g) => g.trim()) : newMovie.genre,
        poster: newMovie.poster || 'https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg',
        banner: newMovie.banner || 'https://image.tmdb.org/t/p/original/bm2r9pUCf3shlkzqlkDdTNHMq8w.jpg',
      };

      const res = await movieService.create(payload);
      if (res.data && res.data.success) {
        toast.success('Movie created successfully!');
        setMovies([...movies, res.data.data]);
        setShowAddMovieModal(false);
        setNewMovie({
          title: '',
          description: '',
          duration: 120,
          genre: 'Action, Drama',
          language: 'English',
          rating: 8.5,
          certification: 'UA',
          poster: '',
          banner: '',
          director: '',
          isNowShowing: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await movieService.delete(id);
      toast.success('Movie removed');
      setMovies(movies.filter((m) => m._id !== id));
    } catch (err) {
      toast.error('Failed to delete movie');
    }
  };

  // KPI Calculations
  const totalRevenue = bookings
    .filter((b) => b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + (b.finalAmount || b.totalAmount || 0), 0);

  const totalBookingsCount = bookings.length;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="px-4 mb-4 text-white font-weight-bold" style={{ letterSpacing: '1px' }}>
          ADMIN CONSOLE
        </div>
        <button
          className={`admin-sidebar-link btn btn-ghost btn-block text-start ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaUsers /> Overview & Metrics
        </button>
        <button
          className={`admin-sidebar-link btn btn-ghost btn-block text-start ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          <FaFilm /> Manage Movies ({movies.length})
        </button>
        <button
          className={`admin-sidebar-link btn btn-ghost btn-block text-start ${activeTab === 'theatres' ? 'active' : ''}`}
          onClick={() => setActiveTab('theatres')}
        >
          <FaStore /> Theatres ({theatres.length})
        </button>
        <button
          className={`admin-sidebar-link btn btn-ghost btn-block text-start ${activeTab === 'shows' ? 'active' : ''}`}
          onClick={() => setActiveTab('shows')}
        >
          <FaCalendarAlt /> Shows & Schedules ({shows.length})
        </button>
        <button
          className={`admin-sidebar-link btn btn-ghost btn-block text-start ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <FaTicketAlt /> All Bookings ({bookings.length})
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {/* KPI Stats Overview Cards */}
        <div className="admin-stats">
          <div className="stat-card revenue">
            <div className="stat-card-value">₹{totalRevenue.toLocaleString()}</div>
            <div className="stat-card-label">Total Revenue Confirmed</div>
            <div className="stat-card-icon">
              <FaRupeeSign />
            </div>
          </div>

          <div className="stat-card bookings">
            <div className="stat-card-value">{totalBookingsCount}</div>
            <div className="stat-card-label">Total Reservations</div>
            <div className="stat-card-icon">
              <FaTicketAlt />
            </div>
          </div>

          <div className="stat-card movies">
            <div className="stat-card-value">{movies.length}</div>
            <div className="stat-card-label">Active Movies</div>
            <div className="stat-card-icon">
              <FaFilm />
            </div>
          </div>

          <div className="stat-card users">
            <div className="stat-card-value">{theatres.length}</div>
            <div className="stat-card-label">Partner Theatres</div>
            <div className="stat-card-icon">
              <FaStore />
            </div>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontFamily: 'var(--font-primary)' }}>Recent System Bookings</h3>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>User</th>
                    <th>Movie</th>
                    <th>Date & Time</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 10).map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontFamily: 'monospace' }}>#{b.bookingId || b._id.slice(-6)}</td>
                      <td>{b.user?.name || b.user?.email || 'Customer'}</td>
                      <td>{b.show?.movie?.title || 'Movie'}</td>
                      <td>{b.show?.date ? new Date(b.show.date).toLocaleDateString() : 'Today'} {b.show?.startTime}</td>
                      <td>{b.seats?.map((s) => s.seatNumber || s).join(', ')}</td>
                      <td className="text-warning font-weight-bold">₹{b.finalAmount || b.totalAmount}</td>
                      <td>
                        <span className={`badge ${b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No bookings yet in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Movies Tab Content */}
        {activeTab === 'movies' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontFamily: 'var(--font-primary)' }}>Movie Catalog</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddMovieModal(true)}
              >
                <FaPlus className="me-1" /> Add New Movie
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Language</th>
                    <th>Duration</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr key={m._id}>
                      <td>
                        <img
                          src={m.poster}
                          alt={m.title}
                          style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td className="fw-bold">{m.title}</td>
                      <td>{m.language}</td>
                      <td>{m.duration}m</td>
                      <td className="text-warning">★ {m.rating}</td>
                      <td>
                        <span className={`badge ${m.isNowShowing ? 'bg-success' : 'bg-secondary'}`}>
                          {m.isNowShowing ? 'Now Showing' : 'Upcoming'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm text-danger"
                          onClick={() => handleDeleteMovie(m._id)}
                          title="Delete Movie"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Theatres Tab Content */}
        {activeTab === 'theatres' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: '1.5rem' }}>Partner Theatres</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Theatre Name</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Screens</th>
                    <th>Amenities</th>
                  </tr>
                </thead>
                <tbody>
                  {theatres.map((t) => (
                    <tr key={t._id}>
                      <td className="fw-bold">{t.name}</td>
                      <td>{t.location?.city}</td>
                      <td>{t.location?.address}</td>
                      <td>{t.screens?.length || 0} Screens</td>
                      <td>{t.amenities?.slice(0, 3).join(', ')}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shows Tab Content */}
        {activeTab === 'shows' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: '1.5rem' }}>Active Show Schedules</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Theatre</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Screen</th>
                    <th>Available Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.slice(0, 20).map((s) => (
                    <tr key={s._id}>
                      <td className="fw-bold">{s.movie?.title || 'Movie'}</td>
                      <td>{s.theatre?.name || 'Theatre'}</td>
                      <td>{new Date(s.date).toLocaleDateString()}</td>
                      <td>{s.startTime}</td>
                      <td>Screen {s.screenNumber || 1}</td>
                      <td>{s.availableSeats} / {s.totalSeats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: '1.5rem' }}>Full Booking Register</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Movie</th>
                    <th>Theatre</th>
                    <th>Seats</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontFamily: 'monospace' }}>#{b.bookingId || b._id.slice(-6)}</td>
                      <td>{b.user?.name || b.user?.email}</td>
                      <td>{b.show?.movie?.title}</td>
                      <td>{b.show?.theatre?.name}</td>
                      <td>{b.seats?.map((s) => s.seatNumber || s).join(', ')}</td>
                      <td className="text-warning">₹{b.finalAmount || b.totalAmount}</td>
                      <td>
                        <span className={`badge ${b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="modal-overlay" onClick={() => setShowAddMovieModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Movie</h3>
              <button className="modal-close" onClick={() => setShowAddMovieModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateMovie}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-6 form-group">
                    <label>Duration (mins)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Rating (out of 10)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={newMovie.rating}
                      onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 form-group">
                    <label>Language</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMovie.language}
                      onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Certification</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMovie.certification}
                      onChange={(e) => setNewMovie({ ...newMovie, certification: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Director</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMovie.director}
                    onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Poster Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://image.tmdb.org/t/p/w500/..."
                    value={newMovie.poster}
                    onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                  />
                </div>
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isNowShowingCheck"
                    checked={newMovie.isNowShowing}
                    onChange={(e) => setNewMovie({ ...newMovie, isNowShowing: e.target.checked })}
                  />
                  <label className="form-check-label text-secondary" htmlFor="isNowShowingCheck">
                    Release immediately as "Now Showing"
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddMovieModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <FaCheck className="me-1" /> Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
