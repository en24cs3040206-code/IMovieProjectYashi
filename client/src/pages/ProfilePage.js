import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimesCircle, FaCheckCircle, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'confirmed', 'cancelled'

  useEffect(() => {
    loadMyBookings();
  }, []);

  const loadMyBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      if (res.data && res.data.data) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund will be processed.')) {
      return;
    }

    try {
      const res = await bookingService.cancelBooking(bookingId);
      if (res.data && res.data.success) {
        toast.success('Booking cancelled successfully! Refund initiated.');
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.bookingStatus === 'confirmed';
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  return (
    <div className="dashboard">
      {/* User Header Profile */}
      <div className="dashboard-header">
        <div className="dashboard-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
        </div>
        <div className="dashboard-user-info">
          <h2>{user?.name}</h2>
          <div className="d-flex flex-wrap gap-3 mt-1 text-secondary" style={{ fontSize: '0.85rem' }}>
            <span>
              <FaEnvelope className="me-1 text-muted" /> {user?.email}
            </span>
            {user?.phone && (
              <span>
                <FaPhone className="me-1 text-muted" /> {user?.phone}
              </span>
            )}
            <span className="badge bg-secondary text-uppercase">{user?.role || 'Member'}</span>
          </div>
        </div>
      </div>

      {/* Bookings Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Active / Confirmed ({bookings.filter((b) => b.bookingStatus === 'confirmed').length})
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state card p-5 text-center">
          <FaTicketAlt size={48} className="text-muted mb-3 mx-auto" />
          <h3>No Bookings Found</h3>
          <p className="text-muted">You haven't made any ticket reservations in this category yet.</p>
          <button className="btn btn-primary mx-auto mt-2" onClick={() => navigate('/movies')}>
            Book a Movie Now
          </button>
        </div>
      ) : (
        <div>
          {filteredBookings.map((b) => {
            const show = b.show || {};
            const movie = show.movie || {};
            const theatre = show.theatre || {};
            const isConfirmed = b.bookingStatus === 'confirmed';

            return (
              <div key={b._id} className="booking-card">
                <div className="booking-card-poster">
                  <img
                    src={
                      movie.poster ||
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60'
                    }
                    alt={movie.title || 'Movie'}
                  />
                </div>

                <div className="booking-card-details">
                  <h3 className="booking-card-title">{movie.title || 'Movie Title'}</h3>

                  <div className="booking-card-meta">
                    <div>
                      <FaMapMarkerAlt className="text-danger me-2" />
                      <strong>{theatre.name || 'Cinema Multiplex'}</strong>
                      <span className="text-muted ms-1">({theatre.location?.city || 'City'})</span>
                    </div>

                    <div>
                      <FaCalendarAlt className="text-warning me-2" />
                      {show.date
                        ? new Date(show.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Date'}
                    </div>

                    <div>
                      <FaClock className="text-info me-2" />
                      {show.startTime || '18:00'} • Screen {show.screenNumber || 1}
                    </div>

                    <div className="mt-2 text-white">
                      Seats:{' '}
                      <strong className="text-warning">
                        {b.seats?.map((s) => s.seatNumber || s).join(', ') || 'N/A'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="booking-card-actions">
                  <div className="text-end">
                    <span className={`booking-status ${isConfirmed ? 'confirmed' : 'cancelled'}`}>
                      {isConfirmed ? (
                        <>
                          <FaCheckCircle className="me-1" /> Confirmed
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="me-1" /> Cancelled
                        </>
                      )}
                    </span>
                    <div className="booking-id mt-2">ID: #{b.bookingId || b._id.slice(-8)}</div>
                    <div className="text-accent fw-bold mt-1" style={{ fontSize: '1.1rem' }}>
                      ₹{b.finalAmount || b.totalAmount}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/confirmation/${b._id}`, { state: { booking: b } })}
                    >
                      <FaTicketAlt className="me-1" /> View Ticket
                    </button>
                    {isConfirmed && (
                      <button
                        className="btn btn-outline btn-sm text-danger border-danger"
                        onClick={() => handleCancelBooking(b._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
