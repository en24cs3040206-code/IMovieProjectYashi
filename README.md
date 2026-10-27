# IMovies 🎬 - Movie Ticket Booking Made Simple

> **A full-stack cinema ticket booking & theatre management platform built with React, Node.js, Express, MongoDB, Socket.io, and Bootstrap.**

IMovies is a modern, responsive online cinema platform designed to deliver a smooth and engaging movie ticket booking experience. Users can browse movies, select showtimes, reserve seats with real-time availability tracking, make simulated payments, and manage bookings. Administrators have access to a dashboard to manage movies, theatres, show schedules, and view revenue analytics.

---

## 🚀 Key Features

### 👤 User Experience
- **Interactive Movie Browsing**: Browse now-showing and upcoming movies with rich metadata (ratings, genres, runtime, certification, trailers, cast).
- **Advanced Filtering & Search**: Instant real-time filtering by genre, language, title, and release status.
- **Showtime & Theatre Selection**: Interactive 7-day calendar date picker, grouping shows by theatre format (IMAX, 4DX, Dolby Atmos, Gold Class).
- **Visual Seat Reservation Matrix**: Interactive SVG-rendered seating layout categorized into Platinum, Gold, and Silver tiers with curved cinema screen perspective.
- **Real-Time Seat Locking**: Powered by **Socket.io** to prevent double-booking and push live seat updates across multiple connected clients.
- **Order Summary & Multi-Gateway Checkout**: Transparent price calculation (Tickets + Convenience Fee + GST) with Card, UPI, and Wallet payment options.
- **Digital E-Tickets**: Instant booking confirmation with reference ID, printable ticket layout, and digital QR code simulation.
- **User Profile & Booking History**: View active and past bookings, with one-click cancellation and automated status updates.
- **Real-Time Notifications**: In-app notifications for ticket confirmations, show reminders, and cancellation alerts.

### 🛡️ Admin Management Console
- **Analytics & KPIs**: Real-time stats on total confirmed revenue, total bookings, active movies, and partner theatres.
- **Movie Catalog Manager**: Add, edit, and delete movies with custom posters, banners, cast, and certifications.
- **Theatres & Screen Layouts**: Configure partner theatres, screens, and amenities.
- **Show Scheduling**: Plan and manage show schedules, assign movies to screens, and adjust tier pricing.
- **Master Booking Register**: Full visibility into all customer reservations and statuses.

---

## 🛠️ Technology Stack & Skills

| Category | Technology |
|---|---|
| **Frontend** | React.js, React Router v6, Bootstrap 5, Vanilla CSS Design System, React Icons, React Toastify |
| **Backend** | Node.js, Express.js, Asynchronous JavaScript (Promises, Async/Await) |
| **Database** | MongoDB & Mongoose ODM (with seamless in-memory fallback for zero-setup execution) |
| **Real-time** | Socket.io (WebSocket seat status streaming) |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt password hashing, Helmet, Express Rate Limiter |
| **Architecture** | RESTful Client-Server Architecture, MVC pattern, Layered middleware |

---

## 📂 Project Structure

```
IMovies/
├── client/                     # React Frontend
│   ├── public/
│   │   └── index.html          # HTML5 entry with Google Fonts & SEO
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.js       # Responsive glassmorphism navigation
│   │   │   ├── Footer.js       # Modern cinema footer
│   │   │   ├── MovieCard.js    # Poster card with hover overlay
│   │   │   ├── SeatLayout.js   # Interactive seat layout
│   │   │   ├── NotificationModal.js # Real-time alerts modal
│   │   │   └── ProtectedRoute.js # Route auth guard
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.js  # JWT Auth & user state
│   │   │   └── BookingContext.js # Multi-step booking state
│   │   ├── pages/              # Application views
│   │   │   ├── HomePage.js     # Blockbuster hero & movie grids
│   │   │   ├── MoviesPage.js   # Full catalog with search/filters
│   │   │   ├── MovieDetailPage.js # Movie overview & showtime selector
│   │   │   ├── BookingPage.js  # Seat matrix with live Socket.io
│   │   │   ├── PaymentPage.js  # Checkout & simulated payment
│   │   │   ├── ConfirmationPage.js # Digital E-ticket & QR
│   │   │   ├── LoginPage.js    # Auth sign-in with demo logins
│   │   │   ├── RegisterPage.js # User registration
│   │   │   ├── ProfilePage.js  # Booking history & cancellations
│   │   │   └── AdminDashboard.js # Admin KPI metrics & catalog CRUD
│   │   ├── services/
│   │   │   ├── api.js          # Axios API client with interceptors
│   │   │   └── socket.js       # Socket.io connection manager
│   │   ├── App.js              # Application routing & layout
│   │   ├── index.css           # 2000+ line curated cinema design system
│   │   └── index.js            # React 18 DOM root
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection with in-memory fallback & auto-seed
│   ├── controllers/            # Request handlers
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── theatreController.js
│   │   ├── showController.js
│   │   ├── bookingController.js
│   │   └── notificationController.js
│   ├── middleware/             # Auth & Error handling
│   │   ├── auth.js             # JWT verification & role authorization
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/                 # Mongoose Data Schemas
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theatre.js
│   │   ├── Show.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── routes/                 # Express API endpoints
│   ├── utils/
│   │   └── seed.js             # Comprehensive cinema database seeder
│   ├── server.js               # Express server & Socket.io entry
│   ├── package.json
│   └── .env
└── README.md
```

---

## 🚦 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (Node v20 LTS recommended)
- **npm**: v9+
- *(Optional)* **MongoDB**: Local MongoDB or MongoDB Atlas URI (if not running, IMovies automatically launches an in-memory database with pre-seeded movies and theatres).

### 2. Backend Setup
```bash
cd IMovies/server
npm install
npm start
```
The server will start on port `5000` (`http://localhost:5000`).

### 3. Frontend Setup
```bash
cd IMovies/client
npm install
npm start
```
The client will start on port `3000` (`http://localhost:3000`).

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@imovies.com` | `admin123` | Admin Dashboard, Movie CRUD, Analytics |
| **User** | `john@example.com` | `password123` | Ticket booking, Seat reservation, History |
| **User** | `jane@example.com` | `password123` | Ticket booking, Seat reservation, History |

*(The login screen also provides 1-click demo login buttons for instant testing).*
