import React from 'react';
import { useBooking } from '../context/BookingContext';

const SeatLayout = ({ show, bookedSeats = [] }) => {
  const { booking, toggleSeat } = useBooking();

  // Price calculation based on show
  const basePrice = show?.price || 200;

  // Categories configuration:
  // Rows A-B: Platinum (basePrice + 100)
  // Rows C-F: Gold (basePrice + 50)
  // Rows G-I: Silver (basePrice)
  const rows = [
    { row: 'A', category: 'Platinum', price: basePrice + 100, seats: 12 },
    { row: 'B', category: 'Platinum', price: basePrice + 100, seats: 12 },
    { row: 'C', category: 'Gold', price: basePrice + 50, seats: 14 },
    { row: 'D', category: 'Gold', price: basePrice + 50, seats: 14 },
    { row: 'E', category: 'Gold', price: basePrice + 50, seats: 14 },
    { row: 'F', category: 'Gold', price: basePrice + 50, seats: 14 },
    { row: 'G', category: 'Silver', price: basePrice, seats: 16 },
    { row: 'H', category: 'Silver', price: basePrice, seats: 16 },
    { row: 'I', category: 'Silver', price: basePrice, seats: 16 },
  ];

  // Group rows by category
  const categories = [
    { name: 'Platinum', rows: rows.filter((r) => r.category === 'Platinum'), price: basePrice + 100 },
    { name: 'Gold', rows: rows.filter((r) => r.category === 'Gold'), price: basePrice + 50 },
    { name: 'Silver', rows: rows.filter((r) => r.category === 'Silver'), price: basePrice },
  ];

  // Check if seat is booked from show.bookedSeats or prop
  const allBooked = new Set([
    ...(show?.bookedSeats || []),
    ...(bookedSeats || []),
  ]);

  return (
    <div className="seat-selection-container">
      {/* Curved Screen Display */}
      <div className="screen-container">
        <div className="screen-display"></div>
        <div className="screen-label">ALL EYES THIS WAY (CINEMA SCREEN)</div>
      </div>

      {/* Seat Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat booked"></div>
          <span>Sold Out</span>
        </div>
      </div>

      {/* Category Groups */}
      {categories.map((cat) => (
        <div key={cat.name} className="seat-category">
          <div className="seat-category-label">
            {cat.name} SECTION • <span className="seat-category-price">₹{cat.price}</span>
          </div>

          {cat.rows.map((rowInfo) => (
            <div key={rowInfo.row} className="seat-row">
              <span className="seat-row-label">{rowInfo.row}</span>

              {Array.from({ length: rowInfo.seats }, (_, i) => {
                const seatNum = i + 1;
                const seatId = `${rowInfo.row}${seatNum}`;
                const isBooked = allBooked.has(seatId);
                const isSelected = booking.selectedSeats.includes(seatId);

                // Add aisle gap in the middle
                const isAisle = (rowInfo.seats === 12 && i === 5) ||
                                (rowInfo.seats === 14 && i === 6) ||
                                (rowInfo.seats === 16 && i === 7);

                return (
                  <React.Fragment key={seatId}>
                    <button
                      type="button"
                      className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                      disabled={isBooked}
                      onClick={() =>
                        !isBooked &&
                        toggleSeat({
                          seatNumber: seatId,
                          category: cat.name,
                          price: cat.price,
                        })
                      }
                      title={
                        isBooked
                          ? `${seatId} (Booked)`
                          : `${seatId} - ${cat.name} (₹${cat.price})`
                      }
                    >
                      {seatNum}
                    </button>
                    {isAisle && <div style={{ width: '20px' }}></div>}
                  </React.Fragment>
                );
              })}

              <span className="seat-row-label">{rowInfo.row}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SeatLayout;
