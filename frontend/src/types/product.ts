import type { ProductColor } from "./productColor";

export interface Product {
  id: number;
  name: string;
  type: "tshirt";
  image: string;
  description: string;
  price: number;
  colors: ProductColor[];
  sizes: string[];
}