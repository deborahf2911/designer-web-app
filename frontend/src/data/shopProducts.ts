import type {
  ProductColor,
} from "../types/productColor";

import tshirtWhite from "../assets/products/tshirt/white/front.png";
import tshirtBlack from "../assets/products/tshirt/black/front.png";

import hoodieBlack from "../assets/products/hoodie/black/front.png";
import hoodieRed from "../assets/products/hoodie/brown/front.png";

import capBlack from "../assets/products/cap/black/front.png";
import capNavy from "../assets/products/cap/black/front.png";

import mugWhite from "../assets/images/categories/mug.jpg";

export interface ShopProductVariant {
  color: ProductColor;

  image: string;

  gallery: string[];
}

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

  variants: ShopProductVariant[];
}

export const shopProducts: ShopProduct[] = [
  {
    id: 101,

    name:
      "Kingdom Classic Tee",

    description:
      "Ready-made Kingdom Threads premium graphic T-shirt.",

    price:
      2490,

    image:
      tshirtWhite,

    gallery: [
      tshirtWhite,
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

    variants: [
      {
        color:
          "white",

        image:
          tshirtWhite,

        gallery: [
          tshirtWhite,
        ],
      },

      {
        color:
          "black",

        image:
          tshirtBlack,

        gallery: [
          tshirtBlack,
        ],
      },
    ],
  },

  {
    id: 102,

    name:
      "Signature Hoodie",

    description:
      "Premium ready-made hoodie from the Kingdom Threads collection.",

    price:
      5990,

    image:
      hoodieBlack,

    gallery: [
      hoodieBlack,
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

    variants: [
      {
        color:
          "black",

        image:
          hoodieBlack,

        gallery: [
          hoodieBlack,
        ],
      },

      {
        color:
          "red",

        image:
          hoodieRed,

        gallery: [
          hoodieRed,
        ],
      },
    ],
  },

  {
    id: 103,

    name:
      "Kingdom Snapback Cap",

    description:
      "Ready-to-order premium cap with Kingdom Threads styling.",

    price:
      1990,

    image:
      capBlack,

    gallery: [
      capBlack,
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

    variants: [
      {
        color:
          "black",

        image:
          capBlack,

        gallery: [
          capBlack,
        ],
      },

      {
        color:
          "navy",

        image:
          capNavy,

        gallery: [
          capNavy,
        ],
      },
    ],
  },

  {
    id: 104,

    name:
      "Kingdom Coffee Mug",

    description:
      "Ready-made ceramic mug from the Kingdom Threads collection.",

    price:
      1290,

    image:
      mugWhite,

    gallery: [
      mugWhite,
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

    variants: [
      {
        color:
          "white",

        image:
          mugWhite,

        gallery: [
          mugWhite,
        ],
      },
    ],
  },
];