import { Request, Response } from "express";
import db from "../config/firebaseConfig";
import { Product } from "../models/productModel";
import admin from "firebase-admin";
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

const docRef = db.collection("products");

//fetch a single data of the product
const fetchSingleProduct = async (productId: string) => {
  const productSnapshot = await docRef.doc(productId).get();
  if (!productSnapshot.exists) {
    console.error(`No product found with id: ${productId}`);
    throw new NotFoundError(`No product found with id: ${productId}`);
  }
  return productSnapshot;
};

//For creating a new sortIndex
const getLastSortIndex = async () => {
  let lastSortIndex = 0;
  const snapshot = await docRef.orderBy("sortIndex", "desc").limit(1).get();
  if (!snapshot.empty) {
    lastSortIndex = snapshot.docs[0].data().sortIndex;
  }
  return lastSortIndex;
};

const createNewSortIndex = async (productId: string) => {
  const productSnapshot = await fetchSingleProduct(productId);
  const productSortIndex = productSnapshot.data().sortIndex;
  let newSortIndex;
  let lastSortIndex = await getLastSortIndex();
  if (productSortIndex === lastSortIndex) {
    newSortIndex = lastSortIndex + 100000;
  } else {
    newSortIndex = productSortIndex + 100;
  }
  return newSortIndex;
};

//Post a new product
export const createProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { category_id, warehouseArea_id, imgUrl } = req.body;
  try {
    // Timestamp
    const currentTimestamp = admin.firestore.Timestamp.now();
    // sortIndex
    const newSortIndex = await createNewSortIndex(productId);

    const productData: Product = {
      category_id,
      warehouseArea_id,
      imgUrl,
      is_discontinued: false,
      memo: "",
      sortIndex: newSortIndex,
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
    switch (true) {
      case error.name === "NotFoundError":
        res.status(404).json({ error: error.message });
        break;
      default:
        res.status(500).json({ error: "Failed to add product." });
    }
  }
};

//Get the all products sorted by "sortIndex"
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productsSnapshot = await docRef.orderBy("sortIndex", "asc").get();
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const productSnapshot = await fetchSingleProduct(productId);
    const productData = {
      id: productSnapshot.id,
      ...productSnapshot.data(),
    };
    res.status(200).json(productData);
  } catch (error) {
    switch (true) {
      case error.name === "NotFoundError":
        res.status(404).json({ error: error.message });
        break;
      default:
        res.status(500).json({ error: "Failed to add product." });
    }
  }
};
