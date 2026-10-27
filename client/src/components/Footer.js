import React from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaHeart, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand">
            <span className="brand-i">
              <FaFilm style={{ marginRight: '8px' }} />
            </span>
            <span>IMovies</span>
          </div>
          <p className="footer-desc">
            Movie ticket booking made simple. Real-time seat reservation, seamless checkout,
            and an extraordinary cinema experience.
          </p>
          <div className="d-flex gap-3 mt-3 text-secondary">
            <a href="#github" className="nav-icon-btn" style={{ width: '36px', height: '36px' }}>
              <FaGithub />
            </a>
            <a href="#twitter" className="nav-icon-btn" style={{ width: '36px', height: '36px' }}>
              <FaTwitter />
            </a>
            <a href="#instagram" className="nav-icon-btn" style={{ width: '36px', height: '36px' }}>
              <FaInstagram />
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-title">Explore</h4>
          <ul className="footer-links">
            <li><Link to="/movies">Now Showing</Link></li>
            <li><Link to="/movies?filter=upcoming">Coming Soon</Link></li>
            <li><Link to="/movies?filter=imax">IMAX Theatres</Link></li>
            <li><Link to="/profile">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Cinemas</h4>
          <ul className="footer-links">
            <li><a href="#theatres">PVR ICON</a></li>
            <li><a href="#theatres">INOX Megaplex</a></li>
            <li><a href="#theatres">Cinepolis VIP</a></li>
            <li><a href="#theatres">Miraj IMAX</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Help & Support</h4>
          <ul className="footer-links">
            <li><a href="#support">24/7 Concierge</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#cancellation">Cancellation & Refund</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} IMovies Cinema Management. All rights reserved.</div>
        <div>
          Crafted with <FaHeart style={{ color: 'var(--primary)', margin: '0 4px' }} /> for movie lovers
        </div>
      </div>
    </footer>
  );
};

export default Footer;
