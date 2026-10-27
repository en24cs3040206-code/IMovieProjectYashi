import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaFilm, FaLock, FaEnvelope, FaUserShield, FaUser } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back to IMovies!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid email or password');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-i mb-2" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>
            <FaFilm />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your IMovies account to book tickets</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaEnvelope className="me-2 text-muted" /> Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock className="me-2 text-muted" /> Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill */}
        <div className="mt-4 pt-3 border-top border-dark">
          <span className="text-muted small d-block mb-2 text-center">Quick Demo Login:</span>
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('john@example.com', 'password123')}
            >
              <FaUser className="me-1" /> Demo User
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('admin@imovies.com', 'admin123')}
            >
              <FaUserShield className="me-1 text-warning" /> Demo Admin
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
