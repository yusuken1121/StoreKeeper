import { Router } from "express";
import { createProduct } from "../controllers/productsController";

export const router = Router();

router.post("/products/:productId", createProduct);
