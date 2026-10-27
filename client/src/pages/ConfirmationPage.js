import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { FaCheckCircle, FaPrint, FaTicketAlt, FaHome, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaQrcode } from 'react-icons/fa';

const ConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking && id) {
      loadBooking();
    }
  }, [id]);

  const loadBooking = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getById(id);
      if (res.data && res.data.data) {
        setBooking(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="empty-state" style={{ marginTop: '100px' }}>
        <h3>Booking Details Not Found</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Back to Home
        </Link>
      </div>
    );
  }

  const show = booking.show || {};
  const movie = show.movie || {};
  const theatre = show.theatre || {};
  const seatNums = booking.seats?.map((s) => s.seatNumber || s).join(', ') || 'Seats Confirmed';

  return (
    <div className="confirmation-page">
      <div className="confirmation-icon">
        <FaCheckCircle />
      </div>

      <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: '2.2rem', marginBottom: '0.25rem' }}>
        Booking Confirmed!
      </h1>
      <p className="text-secondary">
        Your cinema tickets have been booked and confirmed. An e-ticket has been sent to your email.
      </p>

      {/* Confirmation Cinema Ticket */}
      <div className="confirmation-card text-start">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="badge bg-success px-3 py-1">CONFIRMED</span>
            <div className="booking-id mt-1">Ref ID: #{booking.bookingId || booking._id}</div>
          </div>
          <div className="text-end">
            <FaQrcode size={54} className="text-light" />
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Scan at Cinema</div>
          </div>
        </div>

        <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {movie.title || 'Movie Experience'}
        </h3>

        <div className="d-flex flex-column gap-2 text-secondary mb-3" style={{ fontSize: '0.9rem' }}>
          <div>
            <FaMapMarkerAlt className="text-danger me-2" />
            <strong>{theatre.name || 'Cinema Multiplex'}</strong>
            <span className="small text-muted ms-1">({theatre.location?.city || 'City'})</span>
          </div>
          <div>
            <FaCalendarAlt className="text-warning me-2" />
            {show.date
              ? new Date(show.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Today'}
          </div>
          <div>
            <FaClock className="text-info me-2" />
            {show.startTime || 'Showtime'} • Screen {show.screenNumber || 1}
          </div>
        </div>

        <hr className="ticket-divider" />

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted">Reserved Seats:</span>
          <span className="text-white fw-bold" style={{ fontSize: '1.1rem' }}>
            {seatNums}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted">Total Paid:</span>
          <span className="text-warning fw-bold" style={{ fontSize: '1.25rem' }}>
            ₹{booking.finalAmount || booking.totalAmount}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">Payment Mode:</span>
          <span className="text-secondary text-uppercase small">
            {booking.paymentMethod || 'Online Secured'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3 justify-content-center mt-4">
        <button className="btn btn-secondary" onClick={handlePrint}>
          <FaPrint className="me-2" /> Print Ticket
        </button>
        <Link to="/profile" className="btn btn-outline">
          <FaTicketAlt className="me-2" /> My Bookings
        </Link>
        <Link to="/" className="btn btn-primary">
          <FaHome className="me-2" /> Back Home
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
