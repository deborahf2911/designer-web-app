import type { ProductColor } from "./productColor";
import type { ProductView } from "./designer";

export interface CustomizationBreakdown {
  textCount: number;

  imageCount: number;

  premiumFontUsed: boolean;
}

export interface CartItem {
  id: string;

  productId: number;

  productName: string;

  productImage: string;

  /*
   * Main thumbnail used in Cart / Checkout.
   */
  designPreview?: string;

  /*
   * Individual customized-side previews.
   *
   * Example:
   * {
   *   front: "data:image/png;base64,...",
   *   back: "data:image/png;base64,..."
   * }
   */
  designPreviews?: Partial<
    Record<
      ProductView,
      string
    >
  >;

  color: ProductColor;

  size: string;

  quantity: number;

  basePrice: number;

  customized: boolean;

  customization: CustomizationBreakdown;

  customizationPrice: number;

  unitPrice: number;
}