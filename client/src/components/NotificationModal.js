import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { FaTimes, FaBell, FaCheckDouble, FaTicketAlt, FaInfoCircle } from 'react-icons/fa';

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll();
      if (res.data && res.data.data) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="d-flex align-items-center gap-2">
            <FaBell style={{ color: 'var(--primary)' }} />
            <h3 className="m-0">Notifications</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {notifications.length > 0 && (
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleMarkAllRead}
              >
                <FaCheckDouble className="me-1" /> Mark all read
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <FaBell style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '0.5rem' }} />
              <p className="m-0">No notifications yet</p>
            </div>
          ) : (
            <div className="d-flex flex-direction-column gap-2">
              {notifications.map((item) => (
                <div
                  key={item._id}
                  className={`p-3 rounded mb-2 ${item.isRead ? 'bg-dark' : 'bg-secondary'}`}
                  style={{
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                  onClick={() => !item.isRead && handleMarkAsRead(item._id)}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <strong style={{ fontSize: '0.9rem', color: item.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                      {item.type === 'booking' ? <FaTicketAlt className="me-1 text-danger" /> : <FaInfoCircle className="me-1 text-info" />}
                      {item.title}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
