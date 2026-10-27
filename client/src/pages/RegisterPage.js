import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaFilm, FaLock, FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success('Account created successfully! Welcome to IMovies.');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-i mb-2" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>
            <FaFilm />
          </div>
          <h1>Create Account</h1>
          <p>Join IMovies to book cinema tickets seamlessly</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaUser className="me-2 text-muted" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Sarah Connor"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaEnvelope className="me-2 text-muted" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="sarah@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaPhone className="me-2 text-muted" /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock className="me-2 text-muted" /> Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock className="me-2 text-muted" /> Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
