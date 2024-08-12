import express, { Request, Response, NextFunction } from "express";
import { router as productsRouter } from "./routes/productsRoutes";
import cors from "cors";
export const app = express();
const baseUrl = "/api/v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(`${baseUrl}`, productsRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found Route" });
});
