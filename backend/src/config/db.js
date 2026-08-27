require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME || 'inventory-asset-management';

async function connectDB() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured in the environment');
  }

  try {
    await mongoose.connect(mongoUri, { dbName: databaseName });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = { connectDB, mongoose };

