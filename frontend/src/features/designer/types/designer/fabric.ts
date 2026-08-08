import "fabric";

declare module "fabric" {
  interface FabricObject {
    data?: {
      isShirt?: boolean;
    };
  }
}