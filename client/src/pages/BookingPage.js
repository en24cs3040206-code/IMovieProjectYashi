import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showService } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { getSocket, joinShowRoom, leaveShowRoom } from '../services/socket';
import SeatLayout from '../components/SeatLayout';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { booking, setBookingShow } = useBooking();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadShowDetails();

    // Socket real-time room
    joinShowRoom(showId);
    const socket = getSocket();

    const handleSeatUpdate = (data) => {
      if (data && data.showId === showId) {
        setShow((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            bookedSeats: [...new Set([...(prev.bookedSeats || []), ...(data.bookedSeats || [])])],
          };
        });
      }
    };

    socket.on('seatsUpdated', handleSeatUpdate);
    socket.on('seatBooked', handleSeatUpdate);

    return () => {
      leaveShowRoom(showId);
      socket.off('seatsUpdated', handleSeatUpdate);
      socket.off('seatBooked', handleSeatUpdate);
    };
  }, [showId]);

  const loadShowDetails = async () => {
    setLoading(true);
    try {
      const res = await showService.getById(showId);
      if (res.data && res.data.data) {
        const fetchedShow = res.data.data;
        setShow(fetchedShow);
        setBookingShow(fetchedShow.movie, fetchedShow.theatre, fetchedShow);
      } else {
        setError('Show not found');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load show details');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (booking.selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${showId}` } });
      return;
    }

    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="empty-state" style={{ marginTop: '100px' }}>
        <div className="empty-state-icon">⚠️</div>
        <h3>{error || 'Show not found'}</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Go Back
        </button>
      </div>
    );
  }

  const movie = show.movie;
  const theatre = show.theatre;

  return (
    <div className="seat-selection-page">
      {/* Show Header Information */}
      <div
        className="card p-3 p-md-4 mb-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <button
              className="btn btn-ghost btn-sm mb-2 p-0 text-muted"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="me-1" /> Change Showtime / Movie
            </button>
            <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', margin: 0 }}>
              {movie?.title}
            </h2>
            <div className="d-flex align-items-center gap-3 text-secondary mt-1 flex-wrap" style={{ fontSize: '0.85rem' }}>
              <span>
                <FaMapMarkerAlt className="me-1 text-danger" />
                {theatre?.name} ({theatre?.location?.city || 'Main Branch'})
              </span>
              <span>•</span>
              <span>
                <FaCalendarAlt className="me-1 text-warning" />
                {new Date(show.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span>•</span>
              <span>
                <FaClock className="me-1 text-info" />
                {show.startTime}
              </span>
              <span>•</span>
              <span className="badge bg-danger">{show.screenNumber ? `Screen ${show.screenNumber}` : 'Screen 1'}</span>
            </div>
          </div>

          <div className="text-md-end">
            <span className="badge bg-secondary px-3 py-2" style={{ fontSize: '0.85rem' }}>
              {show.availableSeats} Seats Available
            </span>
          </div>
        </div>
      </div>

      {/* Seat Layout Matrix */}
      <SeatLayout show={show} bookedSeats={show.bookedSeats} />

      {/* Sticky Bottom Booking Bar */}
      {booking.selectedSeats.length > 0 && (
        <div className="booking-summary">
          <div className="booking-summary-content">
            <div className="booking-info">
              <div className="selected-seats-info">
                <div>Selected Seats: <strong>{booking.selectedSeats.join(', ')}</strong> ({booking.selectedSeats.length} Tickets)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Includes ₹{booking.convenienceFee} convenience fee & GST
                </div>
              </div>
              <div className="total-price">
                <span className="currency">₹</span>
                {booking.totalAmount}
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={handleProceed}>
              <FaTicketAlt /> Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
