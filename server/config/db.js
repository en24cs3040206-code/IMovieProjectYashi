const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto seed if empty
    const Movie = require('../models/Movie');
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log('📦 Database is empty. Seeding initial cinema data...');
      const { seedDatabase } = require('../utils/seed');
      await seedDatabase(false);
    }
  } catch (error) {
    console.warn(`⚠️ Could not connect to local MongoDB (${error.message}).`);
    console.log('🔄 Initializing in-memory MongoDB fallback...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ In-Memory MongoDB Connected at ${memUri}`);

      console.log('📦 Seeding in-memory cinema database with demo data...');
      const { seedDatabase } = require('../utils/seed');
      await seedDatabase(false);
    } catch (memError) {
      console.error(`❌ In-Memory MongoDB Failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
