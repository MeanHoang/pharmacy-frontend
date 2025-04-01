import { Category } from "./category";
import { ProductImage } from "./product-image";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  discount: number;
  packaging?: string;
  specification?: string;
  indications?: string;
  instructions?: string;
  origin?: string;
  brand?: string;
  ingredients?: string;
  note?: string;
  category_id: number;
  image: string;
  is_sales: boolean;
  created_at: string;
  updated_at?: string;
  ProductImage?: ProductImage[];
  category?: Category;
}
