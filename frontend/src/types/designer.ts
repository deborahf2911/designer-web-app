export type ProductView = "front" | "back" | "left" | "right";

export interface ViewDesign {
  json: string | null;
}

export type DesignStore = Record<ProductView, ViewDesign>;