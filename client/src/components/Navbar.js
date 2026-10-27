import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { FaFilm, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes, FaShieldAlt, FaTicketAlt } from 'react-icons/fa';

const Navbar = ({ onOpenNotifications }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Poll every 30s
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getAll();
      if (res.data && res.data.data) {
        const unread = res.data.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      // Silently catch in navbar
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-i">
            <FaFilm />
          </span>
          <span className="brand-text">IMovies</span>
        </Link>

        {/* Navigation links */}
        <ul className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/movies"
              className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTicketAlt style={{ marginRight: '5px' }} />
                My Bookings
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                style={{ color: 'var(--accent)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShieldAlt style={{ marginRight: '5px' }} />
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <button
                className="nav-icon-btn"
                title="Notifications"
                onClick={onOpenNotifications}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              <Link to="/profile" className="nav-avatar" title={user.name}>
                {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
              </Link>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
                title="Log out"
              >
                <FaSignOutAlt />
                <span className="d-none d-md-inline ms-1">Logout</span>
              </button>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
