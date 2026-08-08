import type { Product } from "../../../types/product";
import type { ProductColor } from "../../../types/productColor";
import type { ProductView } from "../../../types/designer";

export interface DesignState {
  product: Product;

  color: ProductColor;

  size: string;

  currentView: ProductView;

  views: Record<ProductView, string | null>;
}