import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationModal from './components/NotificationModal';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar onOpenNotifications={() => setShowNotifications(true)} />

            <NotificationModal
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />

            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailPage />} />
                <Route path="/booking/:showId" element={<BookingPage />} />
                
                {/* Protected Routes */}
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/confirmation/:id"
                  element={
                    <ProtectedRoute>
                      <ConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Only Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="dark"
            />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
