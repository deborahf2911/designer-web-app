import type { Product } from "../types/product";

import whiteFront from "../assets/products/tshirt/white/front.png";

export const products: Product[] = [
  {
    id: 1,
    name: "Classic T-Shirt",
    description: "100% Cotton Premium Tee",
    price: 1500,
    image: whiteFront,
    colors: ["white", "black", "red", "green", "navy"],
    sizes: ["S", "M", "L", "XL"],
  },
];