import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { bookingService } from '../services/api';
import { toast } from 'react-toastify';
import { FaCreditCard, FaQrcode, FaUniversity, FaWallet, FaLock, FaShieldAlt, FaTicketAlt, FaArrowLeft } from 'react-icons/fa';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { booking, clearBooking } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('•••');
  const [upiId, setUpiId] = useState('user@okaxis');

  if (!booking.show || booking.selectedSeats.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: '120px' }}>
        <div className="empty-state-icon">🎟️</div>
        <h3>No Seats Selected</h3>
        <p>Please select a movie and seats first before heading to payment.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Browse Movies
        </button>
      </div>
    );
  }

  const { movie, theatre, show, selectedSeats, seatDetails, totalAmount } = booking;
  const subtotal = seatDetails.reduce((acc, curr) => acc + curr.price, 0);
  const convenienceFee = 30;
  const tax = Math.round((subtotal + convenienceFee) * 0.18);
  const grandTotal = subtotal + convenienceFee + tax;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        showId: show._id,
        seats: seatDetails.map((s) => ({
          seatNumber: s.seatNumber,
          category: s.category,
        })),
        paymentMethod: paymentMethod === 'card' ? 'credit_card' : paymentMethod === 'upi' ? 'upi' : 'netbanking',
      };

      const res = await bookingService.create(payload);

      if (res.data && res.data.success) {
        const bookingId = res.data.data._id || res.data.data.bookingId;
        toast.success('Payment Successful! Tickets Confirmed.');
        clearBooking();
        navigate(`/confirmation/${bookingId}`, { state: { booking: res.data.data } });
      } else {
        toast.error(res.data?.message || 'Payment processing failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <button
        className="btn btn-ghost btn-sm mb-3 text-muted p-0"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-1" /> Back to Seat Selection
      </button>

      <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: '2rem', marginBottom: '1.5rem' }}>
        Secure <span>Checkout</span>
      </h1>

      <div className="payment-container">
        {/* Payment Methods */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>
            Choose Payment Method
          </h3>

          <div className="payment-methods">
            <div
              className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="method-icon" style={{ color: 'var(--primary)' }}>
                <FaCreditCard />
              </div>
              <div className="flex-grow-1">
                <div className="method-name">Credit / Debit Card</div>
                <small className="text-muted">Visa, MasterCard, RuPay</small>
              </div>
            </div>

            <div
              className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <div className="method-icon" style={{ color: 'var(--accent)' }}>
                <FaQrcode />
              </div>
              <div className="flex-grow-1">
                <div className="method-name">UPI / QR Code</div>
                <small className="text-muted">Google Pay, PhonePe, Paytm</small>
              </div>
            </div>

            <div
              className={`payment-method ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              <div className="method-icon" style={{ color: 'var(--info)' }}>
                <FaUniversity />
              </div>
              <div className="flex-grow-1">
                <div className="method-name">Net Banking</div>
                <small className="text-muted">All major Indian banks</small>
              </div>
            </div>

            <div
              className={`payment-method ${paymentMethod === 'wallet' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('wallet')}
            >
              <div className="method-icon" style={{ color: 'var(--success)' }}>
                <FaWallet />
              </div>
              <div className="flex-grow-1">
                <div className="method-name">IMovies Quick Wallet</div>
                <small className="text-muted">Instant 1-Click Pay</small>
              </div>
            </div>
          </div>

          {/* Payment Form Fields */}
          <div className="card p-3 mt-3">
            {paymentMethod === 'card' && (
              <div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="row">
                  <div className="col-6 form-group">
                    <label>Valid Thru</label>
                    <input
                      type="text"
                      className="form-control"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      className="form-control"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="form-group">
                <label>Enter Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  className="form-control"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                />
              </div>
            )}

            {(paymentMethod === 'netbanking' || paymentMethod === 'wallet') && (
              <div className="text-secondary small py-2">
                You will be redirected to the secure sandbox gateway to authenticate and approve the payment of ₹{grandTotal}.
              </div>
            )}

            <div className="d-flex align-items-center gap-2 text-muted small mt-2">
              <FaLock className="text-success" /> End-to-end 256-bit SSL encrypted transaction
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="order-summary">
            <h3>Booking Breakdown</h3>

            <div className="mb-3 pb-3 border-bottom border-dark">
              <h5 className="m-0 text-white" style={{ fontFamily: 'var(--font-primary)' }}>
                {movie?.title}
              </h5>
              <div className="text-muted small mt-1">
                {theatre?.name} • Screen {show.screenNumber || 1}
              </div>
              <div className="text-warning small">
                {new Date(show.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                at {show.startTime}
              </div>
            </div>

            <div className="summary-row">
              <span className="label">Seats ({selectedSeats.length})</span>
              <span className="value">{selectedSeats.join(', ')}</span>
            </div>

            <div className="summary-row">
              <span className="label">Ticket Subtotal</span>
              <span className="value">₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span className="label">Convenience Fee</span>
              <span className="value">₹{convenienceFee}</span>
            </div>

            <div className="summary-row">
              <span className="label">Integrated GST (18%)</span>
              <span className="value">₹{tax}</span>
            </div>

            <div className="summary-row total">
              <span className="label">Amount Payable</span>
              <span className="value">₹{grandTotal}</span>
            </div>

            <button
              className="btn btn-primary btn-block mt-4"
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? (
                <span>Processing Payment...</span>
              ) : (
                <span>
                  <FaShieldAlt className="me-2" /> Pay ₹{grandTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
