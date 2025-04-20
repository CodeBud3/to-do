import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { setupData } from "./setupTestData";
import { createApp } from "../app";
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
  await setupData();
  global.__APP__ = createApp(mongoose.connection.getClient());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
