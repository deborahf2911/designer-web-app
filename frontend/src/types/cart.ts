import type { ProductColor } from "./productColor";

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

  designPreview?: string;

  color: ProductColor;
  size: string;
  quantity: number;

  basePrice: number;

  customized: boolean;

  customization: CustomizationBreakdown;

  customizationPrice: number;

  unitPrice: number;
}