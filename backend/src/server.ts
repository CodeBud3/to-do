import connectDB from "./config/db";

const PORT: number | string = process.env.PORT || 5000;

const startServer = async () => {
  // connect to DB
  console.log("Starting server...");
  connectDB();
  const app = (await import("./app")).default;

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
