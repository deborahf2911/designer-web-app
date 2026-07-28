import { FabricObject } from "fabric";

export function getDesignObjects(objects: FabricObject[]) {
  return objects.filter(
    (object) => object.selectable === true
  );
}