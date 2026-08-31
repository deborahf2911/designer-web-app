import type { Product } from "../types/product";

// =========================================================
// PRODUCT IMAGES
// =========================================================

import whiteTshirtFront from "../assets/products/tshirt/white/front.png";

import whitePoloFront from "../assets/products/polo/white/front.png";

import whiteOversizedTshirtFront from "../assets/products/oversized-tshirt/white/front.png";

import whiteHoodieFront from "../assets/products/hoodie/white/front.png";

import whiteZipHoodieFront from "../assets/products/zip-hoodie/white/front.png";

import offWhiteOversizedHoodieFront from "../assets/products/oversized-hoodie/off-white/front.png";

import whiteCapFront from "../assets/products/cap/white/front.png";

// =========================================================
// PRODUCTS
// =========================================================

export const products: Product[] = [

  // =======================================================
  // T-SHIRTS
  // =======================================================

  {
    id: 1,

    type: "tshirt",

    name: "Classic T-Shirt",

    designerName:
      "T-Shirt Designer",

    colorLabel:
      "Shirt Color",

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
    id: 4,

    type: "polo",

    name: "Polo T-Shirt",

    designerName:
      "Polo T-Shirt Designer",

    colorLabel:
      "Polo Color",

    description:
      "Smart casual customizable polo shirt for logos, text and custom artwork.",

    price: 2000,

    image:
      whitePoloFront,

    gallery: [
      whitePoloFront,
    ],

    colors: [
      "white",
      "black",
      "green"
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
    id: 5,

    type: "tshirt",

    name: "Oversized T-Shirt",

    designerName:
      "Oversized T-Shirt Designer",

    colorLabel:
      "Shirt Color",

    description:
      "Relaxed oversized customizable T-shirt with a modern streetwear fit.",

    price: 1800,

    image:
      whiteOversizedTshirtFront,

    gallery: [
      whiteOversizedTshirtFront,
    ],

    colors: [
      "white",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    // Only the front image currently exists.
    supportedViews: [
      "front",
    ],

    customizable: true,
  },

  // =======================================================
  // HOODIES
  // =======================================================

  {
    id: 2,

    type: "hoodie",

    name: "Premium Hoodie",

    designerName:
      "Hoodie Designer",

    colorLabel:
      "Hoodie Color",

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
    id: 6,

    type: "hoodie",

    name: "Zip Hoodie",

    designerName:
      "Zip Hoodie Designer",

    colorLabel:
      "Hoodie Color",

    description:
      "Comfortable zip-up hoodie ready for personalized text, logos and artwork.",

    price: 3800,

    image:
      whiteZipHoodieFront,

    gallery: [
      whiteZipHoodieFront,
    ],

    colors: [
      "white",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    // Change this to four views once all four
    // zip-hoodie images are available.
    supportedViews: [
      "front",
    ],

    customizable: true,
  },

  {
    id: 7,

    type: "oversized-hoodie",

    name: "Oversized Hoodie",

    designerName:
      "Oversized Hoodie Designer",

    colorLabel:
      "Hoodie Color",

    description:
      "Relaxed oversized hoodie for bold custom artwork and personalized designs.",

    price: 4200,

    image:
      offWhiteOversizedHoodieFront,

    gallery: [
      offWhiteOversizedHoodieFront,
    ],

    colors: [
      "off-white",
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

  // =======================================================
  // CAPS
  // =======================================================

  {
    id: 3,

    type: "cap",

    name: "Classic Cap",

    designerName:
      "Cap Designer",

    colorLabel:
      "Cap Color",

    description:
      "Premium customizable cap for logos, text and custom artwork.",

    price: 2000,

    image:
      whiteCapFront,

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

    supportedViews: [
      "front",
      "back",
      "left",
      "right",
    ],

    customizable: true,
  },
];