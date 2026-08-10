import type { Product } from "../types/product";

import whiteFront from "../assets/products/tshirt/white/front.png";

export const products: Product[] = [
  {
    id: 1,

    type: "tshirt",

    name: "Classic T-Shirt",

    description:
      "Premium 100% cotton customizable T-shirt.",

    price: 1500,

    image: whiteFront,

    gallery: [whiteFront],

    colors: [
      "white",
      "black",
      "red",
      "green",
      "navy",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    customizable: true,
  },
];