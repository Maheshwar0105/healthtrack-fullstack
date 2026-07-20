import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
  if (!process.env.MONGO_URI) {
    console.error('CRITICAL: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  // Set up connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully.');
  });

  // Attempt connection with retry
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries -= 1;
      console.error(`MongoDB connection failed. Error: ${error.message}. Retries left: ${retries}`);
      if (retries === 0) {
        console.error('CRITICAL: MongoDB connection attempts exhausted. Exiting...');
        process.exit(1);
      }
      console.log(`Waiting ${delay / 1000}s before next retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
