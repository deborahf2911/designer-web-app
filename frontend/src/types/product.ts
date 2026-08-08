export interface Product {
  id: number;

  type: "tshirt";

  name: string;

  description: string;

  price: number;

  image: string;

  gallery: string[];

  colors: string[];

  sizes: string[];

  customizable: boolean;
}