export type ShirtView = "front" | "back" | "left" | "right";

export interface ViewDesign {
  json: string | null;
}

export type DesignStore = Record<ShirtView, ViewDesign>;