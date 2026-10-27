require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
  }
};

const seedDatabase = async (shouldExit = false) => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});

    console.log('Cleared existing data...');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@imovies.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin',
    });

    // Create Regular Users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '9876543211',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '9876543212',
      role: 'user',
    });

    console.log('✅ Users seeded');

    // Create Movies
    const movies = await Movie.insertMany([
      {
        title: 'The Dark Knight Rises',
        description: 'Eight years after the Joker\'s reign of anarchy, Batman, with the help of the enigmatic Selina Kyle, is forced from his exile to save Gotham City from the brutal guerrilla terrorist Bane.',
        duration: 164,
        genre: ['Action', 'Drama', 'Thriller'],
        language: 'English',
        releaseDate: new Date('2024-11-15'),
        rating: 8.4,
        certification: 'PG-13',
        poster: 'https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg',
        banner: 'https://image.tmdb.org/t/p/original/bm2r9pUCf3shlkzqlkDdTNHMq8w.jpg',
        director: 'Christopher Nolan',
        cast: [
          { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
          { name: 'Tom Hardy', role: 'Bane' },
          { name: 'Anne Hathaway', role: 'Selina Kyle' },
        ],
        isNowShowing: true,
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        duration: 148,
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: 'English',
        releaseDate: new Date('2024-10-20'),
        rating: 8.8,
        certification: 'PG-13',
        poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        banner: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        director: 'Christopher Nolan',
        cast: [
          { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
          { name: 'Joseph Gordon-Levitt', role: 'Arthur' },
          { name: 'Elliot Page', role: 'Ariadne' },
        ],
        isNowShowing: true,
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        duration: 169,
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        language: 'English',
        releaseDate: new Date('2024-12-01'),
        rating: 8.7,
        certification: 'PG-13',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        banner: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg',
        director: 'Christopher Nolan',
        cast: [
          { name: 'Matthew McConaughey', role: 'Joseph Cooper' },
          { name: 'Anne Hathaway', role: 'Dr. Amelia Brand' },
          { name: 'Jessica Chastain', role: 'Murph' },
        ],
        isNowShowing: true,
      },
      {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions and restore balance.',
        duration: 181,
        genre: ['Action', 'Adventure', 'Drama'],
        language: 'English',
        releaseDate: new Date('2024-11-01'),
        rating: 8.4,
        certification: 'PG-13',
        poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        banner: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
        director: 'Anthony Russo, Joe Russo',
        cast: [
          { name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man' },
          { name: 'Chris Evans', role: 'Steve Rogers / Captain America' },
          { name: 'Scarlett Johansson', role: 'Natasha Romanoff' },
        ],
        isNowShowing: true,
      },
      {
        title: 'Parasite',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        duration: 132,
        genre: ['Comedy', 'Drama', 'Thriller'],
        language: 'Korean',
        releaseDate: new Date('2024-10-15'),
        rating: 8.5,
        certification: 'R',
        poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        banner: 'https://image.tmdb.org/t/p/original/TU9SUjwXf2Fy0U6VrTNQXMl2WB6.jpg',
        director: 'Bong Joon-ho',
        cast: [
          { name: 'Song Kang-ho', role: 'Kim Ki-taek' },
          { name: 'Lee Sun-kyun', role: 'Park Dong-ik' },
          { name: 'Cho Yeo-jeong', role: 'Choi Yeon-gyo' },
        ],
        isNowShowing: true,
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
        duration: 166,
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        releaseDate: new Date('2025-01-15'),
        rating: 8.6,
        certification: 'PG-13',
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        banner: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        director: 'Denis Villeneuve',
        cast: [
          { name: 'Timothée Chalamet', role: 'Paul Atreides' },
          { name: 'Zendaya', role: 'Chani' },
          { name: 'Austin Butler', role: 'Feyd-Rautha' },
        ],
        isNowShowing: false,
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        duration: 180,
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        releaseDate: new Date('2024-11-20'),
        rating: 8.3,
        certification: 'R',
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        banner: 'https://image.tmdb.org/t/p/original/nb3xI8SliMQ00s2RNkYKcEF7jkg.jpg',
        director: 'Christopher Nolan',
        cast: [
          { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer' },
          { name: 'Emily Blunt', role: 'Kitty Oppenheimer' },
          { name: 'Robert Downey Jr.', role: 'Lewis Strauss' },
        ],
        isNowShowing: true,
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        duration: 140,
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        releaseDate: new Date('2024-10-25'),
        rating: 8.7,
        certification: 'PG',
        poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        banner: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
        director: 'Joaquim Dos Santos',
        cast: [
          { name: 'Shameik Moore', role: 'Miles Morales (voice)' },
          { name: 'Hailee Steinfeld', role: 'Gwen Stacy (voice)' },
          { name: 'Oscar Isaac', role: 'Miguel O\'Hara (voice)' },
        ],
        isNowShowing: true,
      },
      {
        title: 'RRR',
        description: 'A fictitious story about two legendary revolutionaries and their journey away from home before they began fighting for their country in the 1920s.',
        duration: 187,
        genre: ['Action', 'Drama'],
        language: 'Hindi',
        releaseDate: new Date('2024-12-10'),
        rating: 7.8,
        certification: 'UA',
        poster: 'https://image.tmdb.org/t/p/w500/nEufeZYoDBLBRElmJRHlb5gvVNi.jpg',
        banner: 'https://image.tmdb.org/t/p/original/xDMIl84Qo5Tmu6LA4ybEXFYGjys.jpg',
        director: 'S.S. Rajamouli',
        cast: [
          { name: 'N.T. Rama Rao Jr.', role: 'Komaram Bheem' },
          { name: 'Ram Charan', role: 'Alluri Sitarama Raju' },
          { name: 'Alia Bhatt', role: 'Sita' },
        ],
        isNowShowing: true,
      },
      {
        title: 'The Shawshank Redemption',
        description: 'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
        duration: 142,
        genre: ['Drama'],
        language: 'English',
        releaseDate: new Date('2025-02-01'),
        rating: 9.3,
        certification: 'R',
        poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        banner: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
        director: 'Frank Darabont',
        cast: [
          { name: 'Tim Robbins', role: 'Andy Dufresne' },
          { name: 'Morgan Freeman', role: 'Ellis Boyd "Red" Redding' },
        ],
        isNowShowing: false,
      },
    ]);

    console.log('✅ Movies seeded');

    // Create Theatres
    const theatres = await Theatre.insertMany([
      {
        name: 'PVR Cinemas - Phoenix Mall',
        location: {
          address: 'Phoenix MarketCity, LBS Marg, Kurla',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400070',
        },
        screens: [
          {
            screenNumber: 1,
            screenName: 'Audi 1 - IMAX',
            screenType: 'IMAX',
            totalSeats: 120,
            seatLayout: {
              rows: 10,
              columns: 12,
              categories: [
                { name: 'Silver', price: 250, rows: [1, 2, 3] },
                { name: 'Gold', price: 350, rows: [4, 5, 6, 7] },
                { name: 'Platinum', price: 500, rows: [8, 9] },
                { name: 'Recliner', price: 750, rows: [10] },
              ],
            },
          },
          {
            screenNumber: 2,
            screenName: 'Audi 2',
            screenType: 'Dolby Atmos',
            totalSeats: 96,
            seatLayout: {
              rows: 8,
              columns: 12,
              categories: [
                { name: 'Silver', price: 200, rows: [1, 2, 3] },
                { name: 'Gold', price: 300, rows: [4, 5, 6] },
                { name: 'Platinum', price: 450, rows: [7, 8] },
              ],
            },
          },
          {
            screenNumber: 3,
            screenName: 'Audi 3',
            screenType: 'Standard',
            totalSeats: 80,
            seatLayout: {
              rows: 8,
              columns: 10,
              categories: [
                { name: 'Silver', price: 150, rows: [1, 2, 3] },
                { name: 'Gold', price: 250, rows: [4, 5, 6] },
                { name: 'Platinum', price: 350, rows: [7, 8] },
              ],
            },
          },
        ],
        amenities: ['Parking', 'Food Court', 'Dolby Sound', 'IMAX', 'Recliner Seats', 'Online Booking', 'M-Ticket'],
        contactNumber: '1800-209-0001',
        email: 'phoenix@pvr.com',
      },
      {
        name: 'INOX - Insignia',
        location: {
          address: 'Nehru Place, South Delhi',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110019',
        },
        screens: [
          {
            screenNumber: 1,
            screenName: 'Screen 1 - Premium',
            screenType: 'Premium',
            totalSeats: 100,
            seatLayout: {
              rows: 10,
              columns: 10,
              categories: [
                { name: 'Silver', price: 200, rows: [1, 2, 3] },
                { name: 'Gold', price: 350, rows: [4, 5, 6, 7] },
                { name: 'Diamond', price: 550, rows: [8, 9] },
                { name: 'Recliner', price: 800, rows: [10] },
              ],
            },
          },
          {
            screenNumber: 2,
            screenName: 'Screen 2',
            screenType: 'Standard',
            totalSeats: 80,
            seatLayout: {
              rows: 8,
              columns: 10,
              categories: [
                { name: 'Silver', price: 180, rows: [1, 2, 3] },
                { name: 'Gold', price: 280, rows: [4, 5, 6] },
                { name: 'Platinum', price: 400, rows: [7, 8] },
              ],
            },
          },
        ],
        amenities: ['Parking', 'Food Court', 'Wheelchair Access', 'Recliner Seats', 'Online Booking'],
        contactNumber: '1800-209-0002',
        email: 'insignia@inox.com',
      },
      {
        name: 'Cinépolis - Forum Mall',
        location: {
          address: 'Forum Mall, Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560095',
        },
        screens: [
          {
            screenNumber: 1,
            screenName: 'Screen 1 - 4DX',
            screenType: '4DX',
            totalSeats: 90,
            seatLayout: {
              rows: 9,
              columns: 10,
              categories: [
                { name: 'Silver', price: 220, rows: [1, 2, 3] },
                { name: 'Gold', price: 380, rows: [4, 5, 6] },
                { name: 'Platinum', price: 520, rows: [7, 8, 9] },
              ],
            },
          },
          {
            screenNumber: 2,
            screenName: 'Screen 2',
            screenType: 'Standard',
            totalSeats: 100,
            seatLayout: {
              rows: 10,
              columns: 10,
              categories: [
                { name: 'Silver', price: 160, rows: [1, 2, 3, 4] },
                { name: 'Gold', price: 260, rows: [5, 6, 7] },
                { name: 'Platinum', price: 380, rows: [8, 9, 10] },
              ],
            },
          },
        ],
        amenities: ['Parking', 'Food Court', '3D', 'Online Booking', 'M-Ticket'],
        contactNumber: '1800-209-0003',
        email: 'forum@cinepolis.com',
      },
    ]);

    console.log('✅ Theatres seeded');

    // Create Shows - generate shows for the next 7 days
    const showTimes = [
      { start: '09:30', end: '12:30' },
      { start: '13:00', end: '16:00' },
      { start: '16:30', end: '19:30' },
      { start: '20:00', end: '23:00' },
    ];

    const showsData = [];
    const activeMovies = movies.filter((m) => m.isNowShowing);

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const showDate = new Date();
      showDate.setDate(showDate.getDate() + dayOffset);
      showDate.setHours(0, 0, 0, 0);

      for (const theatre of theatres) {
        for (const screen of theatre.screens) {
          // Assign 2 movies per screen per day
          const shuffled = [...activeMovies].sort(() => 0.5 - Math.random());
          const selectedMovies = shuffled.slice(0, Math.min(4, showTimes.length));

          for (let i = 0; i < selectedMovies.length; i++) {
            const movie = selectedMovies[i];
            const time = showTimes[i];

            showsData.push({
              movie: movie._id,
              theatre: theatre._id,
              screenNumber: screen.screenNumber,
              date: new Date(showDate),
              startTime: time.start,
              endTime: time.end,
              pricing: screen.seatLayout.categories.map((cat) => ({
                category: cat.name,
                price: cat.price,
              })),
              totalSeats: screen.totalSeats,
              availableSeats: screen.totalSeats,
              bookedSeats: [],
            });
          }
        }
      }
    }

    await Show.insertMany(showsData);
    console.log(`✅ ${showsData.length} Shows seeded`);

    console.log('\n🎬 Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('   Admin: admin@imovies.com / admin123');
    console.log('   User:  john@example.com / password123');
    console.log('   User:  jane@example.com / password123\n');

    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding error:', error);
    if (shouldExit) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = { seedDatabase };
