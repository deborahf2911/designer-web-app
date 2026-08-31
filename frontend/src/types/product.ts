import type { ProductColor } from "./productColor";
import type { ProductView } from "./designer";

export type ProductType =
  | "tshirt"
  | "oversized-tshirt"
  | "polo"
  | "hoodie"
  | "zip-hoodie"
  | "oversized-hoodie"
  | "cap"
  | "mug"
  | "tote";

export interface Product {
  id: number;

  name: string;

  type: ProductType;

  image: string;

  gallery: string[];

  description: string;

  price: number;

  colors: ProductColor[];

  sizes: string[];

  customizable: boolean;

  supportedViews: ProductView[];

  designerName?: string;

  colorLabel?: string;
}