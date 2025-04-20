import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONDO_DB_CONNECT!);
    console.log(`MongoDB Connected: ${conn?.connection.host}`);
    return mongoose.connection.getClient();
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process on failure
  }
};

export const getMongoStore = (mongoClient: MongoClient) => {
  return MongoStore.create({
    client: mongoClient, // Use the existing connection
    collectionName: "sessions",
  });
};

export const startTransaction =
  async (): Promise<mongoose.mongo.ClientSession> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  };

export const commitTransaction = async (
  session: mongoose.mongo.ClientSession
) => {
  await session.commitTransaction();
  session.endSession();
};

export const rollBackTransaction = async (
  session: mongoose.mongo.ClientSession
) => {
  await session.abortTransaction();
  session.endSession();
};

export default connectDB;
