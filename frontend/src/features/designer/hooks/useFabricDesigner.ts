import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
} from "react";

import { Canvas, FabricImage, type FabricObject } from "fabric";

import type { ProductView } from "../../../types/designer";
import type { ProductColor } from "../../../types/productColor";
import { productAssets } from "../config/productAssets";
import { productDisplay } from "../config/productDisplay";
import type { Product } from "../../../types/product";

export interface FabricDesignerHandle {
  addImage(file: File): Promise<void>;
  deleteSelected(): void;
}

export function useFabricDesigner(
    product: Product,
    currentView: ProductView,
    productColor: ProductColor,
    ref: ForwardedRef<FabricDesignerHandle>
) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<Canvas | null>(null);

  // Current product image
  const productRef = useRef<FabricImage | null>(null);

  // Save design objects for each side
  const designsRef = useRef<
    Record<ProductView, ReturnType<FabricObject["toObject"]>[]>
  >({
    front: [],
    back: [],
    left: [],
    right: [],
  });

  const previousViewRef = useRef<ProductView>("front");

  //--------------------------------------------------
  // Create Fabric canvas ONCE
  //--------------------------------------------------

  useEffect(() => {
    if (!canvasElementRef.current) return;

    const canvas = new Canvas(canvasElementRef.current, {
      width: 700,
      height: 700,
      backgroundColor: "#e5e7eb",
      preserveObjectStacking: true,
    });

    canvasRef.current = canvas;

    void loadProduct("front", productColor);

    return () => {
      canvas.dispose();
    };
  }, []);

  //--------------------------------------------------
  // Change side
  //--------------------------------------------------

  useEffect(() => {
    if (!canvasRef.current) return;

    if (currentView === previousViewRef.current) return;

    void switchSide(currentView);
  }, [currentView]);

  //--------------------------------------------------
  // Change product color
  //--------------------------------------------------

  useEffect(() => {
    if (!canvasRef.current) return;

    void updateProductColor(currentView, productColor);
  }, [productColor]);

  //--------------------------------------------------
  // Save current design objects
  //--------------------------------------------------

  function saveCurrentDesign(side: ProductView) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const objects = canvas
      .getObjects()
      .filter((obj) => !(obj as any).data?.isProduct);

    designsRef.current[side] = objects.map((obj) =>
      obj.toObject(["data"])
    );
  }

  //--------------------------------------------------
  // Restore design objects
  //--------------------------------------------------

  async function restoreDesign(side: ProductView) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const objects = designsRef.current[side];

    for (const objectData of objects) {
      if ((objectData as any).data?.isProduct) {
        continue;
      }

      if (objectData.type === "Image" && (objectData as any).src) {
        const image = await FabricImage.fromURL(
          (objectData as any).src
        );

        image.set({
          left: objectData.left,
          top: objectData.top,
          scaleX: objectData.scaleX,
          scaleY: objectData.scaleY,
          angle: objectData.angle,
          originX: objectData.originX,
          originY: objectData.originY,
        });

        canvas.add(image);
      }
    }
  }

  //--------------------------------------------------
  // Load product image
  //--------------------------------------------------

  async function loadProduct(view: ProductView, color: ProductColor) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Remove previous product image
    canvas.getObjects().forEach((obj) => {
      if ((obj as any).data?.isProduct) {
        canvas.remove(obj);
      }
    });

    const productImage = await FabricImage.fromURL(
      productAssets[product.type][color][view]
    );

    const display =
    productDisplay[product.type][view];

    productImage.scaleToWidth(display.width);

    productImage.set({
      left: display.left,
      top: display.top,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    });

    (productImage as any).data = {
      isProduct: true,
    };

    productRef.current = productImage;

    canvas.add(productImage);
    canvas.moveObjectTo(productImage, 0);
    canvas.renderAll();
  }

  //--------------------------------------------------
  // Switch side
  //--------------------------------------------------

  async function switchSide(view: ProductView) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save previous side
    saveCurrentDesign(previousViewRef.current);

    // Remove all non-product objects
    canvas.getObjects().forEach((obj) => {
      if (!(obj as any).data?.isProduct) {
        canvas.remove(obj);
      }
    });

    // Load new product
    await loadProduct(view, productColor);

    // Restore new side design
    await restoreDesign(view);

    canvas.renderAll();

    previousViewRef.current = view;
  }

  //--------------------------------------------------
  // Update product color only
  //--------------------------------------------------

  async function updateProductColor(
    view: ProductView,
    color: ProductColor
  ) {
    await loadProduct(view, color);
  }

  //--------------------------------------------------
  // Upload image
  //--------------------------------------------------

  async function addImage(file: File) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const image = await FabricImage.fromURL(
        reader.result as string
      );

      image.scaleToWidth(120);

      image.set({
        left: 350,
        top: 320,
        originX: "center",
        originY: "center",
      });

      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    };

    reader.readAsDataURL(file);
  }

  //--------------------------------------------------
  // Delete selected image
  //--------------------------------------------------

  function deleteSelected() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (!activeObject) return;

    // Never allow the product image to be deleted
    if ((activeObject as any).data?.isProduct) {
      return;
    }

    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Delete" && e.key !== "Backspace") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Never delete the T-shirt itself
    if ((activeObject as any).data?.isProduct) return;

    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //--------------------------------------------------
  // Expose API
  //--------------------------------------------------

  useImperativeHandle(ref, () => ({
    addImage,
    deleteSelected,
  }));

  return canvasElementRef;
}