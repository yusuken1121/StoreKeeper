import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
} from "../controllers/productsController";

export const router = Router();

router.get("/products", getAllProducts);
router.get("/products/:productId", getProduct);
router.post("/products/:productId", createProduct);
