import express, { Application, Request, Response } from "express";
import "dotenv/config";
import router from "./routes";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use("/", router);
// Example route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to to-do App");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
