import app from "./app";
import connectDB from "./config/db";

const PORT: number | string = process.env.PORT || 5000;

// connect to DB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
