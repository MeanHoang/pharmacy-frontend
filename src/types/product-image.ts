import { Product } from "./product";

export interface ProductImage {
  id: number;
  product_id: string;
  image: string;

  created_at: string;
  updated_at?: string;
  product?: Product;
}
