import type {
  ProductColor,
} from "../types/productColor";

import tshirtImage from "../assets/products/tshirt/white/front.png";
import hoodieImage from "../assets/images/categories/hoodie.jpg";
import capImage from "../assets/images/categories/cap.jpg";
import mugImage from "../assets/images/categories/mug.jpg";

export interface ShopProduct {
  id: number;

  name: string;

  description: string;

  price: number;

  image: string;

  gallery: string[];

  category:
    | "tshirt"
    | "hoodie"
    | "polo"
    | "mug"
    | "cap"
    | "tote";

  colors: ProductColor[];

  sizes: string[];

  customizable: false;

  badge?: string;
}

export const shopProducts: ShopProduct[] = [
  {
    id: 101,

    name:
      "Kingdom Classic Tee",

    description:
      "Ready-made Kingdom Threads premium graphic T-shirt.",

    price: 2490,

    image:
      tshirtImage,

    gallery: [
      tshirtImage,
    ],

    category:
      "tshirt",

    colors: [
      "white",
      "black",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    customizable:
      false,

    badge:
      "Best Seller",
  },

  {
    id: 102,

    name:
      "Signature Hoodie",

    description:
      "Premium ready-made hoodie from the Kingdom Threads collection.",

    price: 5990,

    image:
      hoodieImage,

    gallery: [
      hoodieImage,
    ],

    category:
      "hoodie",

    colors: [
      "black",
      "red",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    customizable:
      false,

    badge:
      "New",
  },

  {
    id: 103,

    name:
      "Kingdom Snapback Cap",

    description:
      "Ready-to-order premium cap with Kingdom Threads styling.",

    price: 1990,

    image:
      capImage,

    gallery: [
      capImage,
    ],

    category:
      "cap",

    colors: [
      "black",
      "navy",
    ],

    sizes: [
      "One Size",
    ],

    customizable:
      false,

    badge:
      "Popular",
  },

  {
    id: 104,

    name:
      "Kingdom Coffee Mug",

    description:
      "Ready-made ceramic mug from the Kingdom Threads collection.",

    price: 1290,

    image:
      mugImage,

    gallery: [
      mugImage,
    ],

    category:
      "mug",

    colors: [
      "white",
    ],

    sizes: [
      "Standard",
    ],

    customizable:
      false,

    badge:
      "Trending",
  },
];