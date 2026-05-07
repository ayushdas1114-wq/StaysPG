const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  const MONGO_URI = process.env.MONGO_URI;
  
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    
    cachedConnection = conn;
    console.log('MongoDB Connected');
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // In serverless, we don't necessarily want to exit the process
    // as it might kill other active functions, but for cold starts it's okay
    // if (process.env.NODE_ENV !== 'production') {
    //   process.exit(1);
    // }
    // throw error;
  }
};

module.exports = connectDB;
