import { createApp } from "./app";
import connectDB from "./config/db";

const PORT: number | string = process.env.PORT || 5000;

const startServer = async () => {
  // connect to DB
  console.log("Starting server...");
  const mongoClient = await connectDB();
  const app = await createApp(mongoClient);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
