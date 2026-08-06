import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
} from "react";

import { Canvas, FabricImage, type FabricObject } from "fabric";

import type { ProductView } from "../../types/designer";
import type { ProductColor } from "../../types/productColor";
import { shirtAssets } from "../../config/designer/productAssets";
import { shirtSizes } from "../../config/designer/productSizes";

export interface FabricDesignerHandle {
  addImage(file: File): Promise<void>;
}

export function useFabricDesigner(
  currentView: ProductView,
  productColor: ProductColor,
  ref: ForwardedRef<FabricDesignerHandle>
) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<Canvas | null>(null);

  // Current shirt image
  const shirtRef = useRef<FabricImage | null>(null);

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

    void loadShirt("front", productColor);

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
  // Change shirt color
  //--------------------------------------------------

  useEffect(() => {
    if (!canvasRef.current) return;

    void updateShirtColor(currentView, productColor);
  }, [productColor]);

  //--------------------------------------------------
  // Save current design objects
  //--------------------------------------------------

  function saveCurrentDesign(side: ProductView) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const objects = canvas
      .getObjects()
      .filter((obj) => !(obj as any).data?.isShirt);

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
      if ((objectData as any).data?.isShirt) {
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
  // Load shirt image
  //--------------------------------------------------

  async function loadShirt(view: ProductView, color: ProductColor) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Remove old shirt
    canvas.getObjects().forEach((obj) => {
      if ((obj as any).data?.isShirt) {
        canvas.remove(obj);
      }
    });

    const shirt = await FabricImage.fromURL(
      shirtAssets.tshirt[color][view]
    );


    shirt.scaleToWidth(shirtSizes[view]);

    shirt.set({
      left: 350,
      top: 350,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    });

    (shirt as any).data = {
      isShirt: true,
    };

    shirtRef.current = shirt;

    canvas.add(shirt);
    canvas.moveObjectTo(shirt, 0);
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

    // Remove all non-shirt objects
    canvas.getObjects().forEach((obj) => {
      if (!(obj as any).data?.isShirt) {
        canvas.remove(obj);
      }
    });

    // Load new shirt
    await loadShirt(view, productColor);

    // Restore new side design
    await restoreDesign(view);

    canvas.renderAll();

    previousViewRef.current = view;
  }

  //--------------------------------------------------
  // Update shirt color only
  //--------------------------------------------------

  async function updateShirtColor(
    view: ProductView,
    color: ProductColor
  ) {
    await loadShirt(view, color);
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
  // Expose API
  //--------------------------------------------------

  useImperativeHandle(ref, () => ({
    addImage,
  }));

  return canvasElementRef;
}