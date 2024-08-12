import { Timestamp } from "firebase-admin/firestore";
export interface Product {
  id?: string;
  category_id: number;
  warehouseArea_id: number;
  imgUrl: string;
  is_discontinued: boolean;
  memo: string;
  sortIndex: number;
  is_store_xs: boolean;
  is_store_s: boolean;
  is_store_m: boolean;
  is_store_l: boolean;
  is_store_xl: boolean;
  timestamp_store: Timestamp;
  is_stock_xs: boolean;
  is_stock_s: boolean;
  is_stock_m: boolean;
  is_stock_l: boolean;
  is_stock_xl: boolean;
  timestamp_stock: Timestamp;
}
