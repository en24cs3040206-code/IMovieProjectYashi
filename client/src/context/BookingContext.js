import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    movie: null,
    theatre: null,
    show: null,
    selectedSeats: [], // array of seat identifiers e.g. ["A1", "A2"]
    seatDetails: [], // array of { seatNumber, category, price }
    totalAmount: 0,
    convenienceFee: 30,
  });

  const setBookingShow = (movie, theatre, show) => {
    setBooking((prev) => ({
      ...prev,
      movie,
      theatre,
      show,
      selectedSeats: [],
      seatDetails: [],
      totalAmount: 0,
    }));
  };

  const toggleSeat = (seatObj) => {
    setBooking((prev) => {
      const exists = prev.selectedSeats.includes(seatObj.seatNumber);
      let updatedSeats = [];
      let updatedDetails = [];

      if (exists) {
        updatedSeats = prev.selectedSeats.filter((s) => s !== seatObj.seatNumber);
        updatedDetails = prev.seatDetails.filter((s) => s.seatNumber !== seatObj.seatNumber);
      } else {
        if (prev.selectedSeats.length >= 8) {
          alert('You can select a maximum of 8 seats per booking.');
          return prev;
        }
        updatedSeats = [...prev.selectedSeats, seatObj.seatNumber];
        updatedDetails = [...prev.seatDetails, seatObj];
      }

      const seatsPrice = updatedDetails.reduce((sum, item) => sum + item.price, 0);
      const totalAmount = seatsPrice > 0 ? seatsPrice + prev.convenienceFee : 0;

      return {
        ...prev,
        selectedSeats: updatedSeats,
        seatDetails: updatedDetails,
        totalAmount,
      };
    });
  };

  const clearBooking = () => {
    setBooking({
      movie: null,
      theatre: null,
      show: null,
      selectedSeats: [],
      seatDetails: [],
      totalAmount: 0,
      convenienceFee: 30,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setBookingShow,
        toggleSeat,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
