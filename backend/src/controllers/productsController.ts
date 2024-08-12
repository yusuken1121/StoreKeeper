import { Request, Response } from "express";
import db from "../config/firebaseConfig";
import { Product } from "../models/productModel";
import admin from "firebase-admin";

const docRef = db.collection("products");
const getLastSortIndex = async () => {
  let lastSortIndex = 0;
  const snapshot = await docRef.orderBy("sortIndex", "desc").limit(1).get();
  if (!snapshot.empty) {
    lastSortIndex = snapshot.docs[0].data().sortIndex + 10000;
  }
  return lastSortIndex;
};

export const createProduct = async (req: Request, res: Response) => {
  const { category_id, warehouseArea_id, imgUrl } = req.body;
  try {
    // Timestamp
    const currentTimestamp = admin.firestore.Timestamp.now();
    // sortIndex
    const lastSortIndex = await getLastSortIndex();

    const productData: Product = {
      category_id,
      warehouseArea_id,
      imgUrl,
      is_discontinued: false,
      memo: "",
      sortIndex: lastSortIndex,
      is_store_xs: false,
      is_store_s: false,
      is_store_m: false,
      is_store_l: false,
      is_store_xl: false,
      timestamp_store: currentTimestamp,
      is_stock_xs: false,
      is_stock_s: false,
      is_stock_m: false,
      is_stock_l: false,
      is_stock_xl: false,
      timestamp_stock: currentTimestamp,
    };

    await docRef.add(productData);
    res.status(201).json(productData);
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ error: "Failed to add product." });
  }
};
