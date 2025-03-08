import { Router, Request, Response } from "express";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API!" });
});

export default router;
