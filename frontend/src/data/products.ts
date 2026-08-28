import type { Product } from "../types/product";

import whiteTshirtFront from "../assets/products/tshirt/white/front.png";
import whiteHoodieFront from "../assets/products/hoodie/white/front.png";
import whiteCapFront from "../assets/products/cap/white/front.png";

export const products: Product[] = [
  {
    id: 1,

    type: "tshirt",

    name: "Classic T-Shirt",

    designerName: "T-Shirt Designer",

    colorLabel: "Shirt Color",

    description:
      "Premium 100% cotton customizable T-shirt.",

    price: 1500,

    image:
      whiteTshirtFront,

    gallery: [
      whiteTshirtFront,
    ],

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

    supportedViews: [
      "front",
      "back",
      "left",
      "right",
    ],

    customizable: true,
  },

  {
    id: 2,

    type: "hoodie",

    name: "Premium Hoodie",

    designerName: "Hoodie Designer",

    colorLabel: "Hoodie Color",

    description:
      "Comfortable premium customizable hoodie.",

    price: 3500,

    image:
      whiteHoodieFront,

    gallery: [
      whiteHoodieFront,
    ],

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

    supportedViews: [
      "front",
      "back",
      "left",
      "right",
    ],

    customizable: true,
  },
  {
    id: 3,

    type: "cap",

    name: "Classic Cap",

    description:
      "Premium customizable cap for logos, text and custom artwork.",

    price: 2000,

    image: whiteCapFront,

    gallery: [
      whiteCapFront,
    ],

    colors: [
      "white",
      "black",
    ],

    sizes: [
      "One Size",
    ],

    customizable: true,

    supportedViews: [
      "front",
      "back",
      "left",
      "right",
    ],

    designerName:
      "Cap Designer",

    colorLabel:
      "Cap Color",
  },
];