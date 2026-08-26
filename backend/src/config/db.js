const mongoose = require('mongoose');

/**
 * Connects to MongoDB. Call once at startup (see server.js).
 * Multi-document transactions (used for purchases/transfers/assignments)
 * require MongoDB to be running as a replica set — a local single-node
 * replica set or MongoDB Atlas both satisfy this out of the box.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-asset-management';
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = { connectDB, mongoose };
