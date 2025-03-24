import MongoStore from "connect-mongo";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONDO_DB_CONNECT!);
    console.log(`MongoDB Connected: ${conn?.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process on failure
  }
};

export const getMongoStore = () => {
  return MongoStore.create({
    client: mongoose.connection.getClient(), // Use the existing connection
    collectionName: "sessions",
  });
};
export default connectDB;
