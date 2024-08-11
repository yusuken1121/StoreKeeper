import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found Route" });
});
