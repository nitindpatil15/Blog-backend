import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from './constant.js';

const connectDb = async () => {
  try {
    const connectioncontain = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log(`MongoDB connected!! DB Host: ${connectioncontain.connection.host}`);
    return connectioncontain; // Return the connection object
  } catch (error) {
    console.log("MongoDB Connection failed: ", error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
};

export default connectDb;