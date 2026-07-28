import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
} from "react";

import { Canvas, FabricImage } from "fabric";

import type { ShirtView } from "../../types/designer";
import { shirtAssets } from "../../config/designer/shirtAssets";
import { shirtSizes } from "../../config/designer/shirtSizes";

export interface FabricDesignerHandle {
  addImage(file: File): Promise<void>;
}

export function useFabricDesigner(
  currentView: ShirtView,
  ref: ForwardedRef<FabricDesignerHandle>
) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);

  const canvasRef = useRef<Canvas | null>(null);

  const previousViewRef = useRef<ShirtView>("front");

  // Save one Fabric JSON for each shirt side
  const designsRef = useRef<Record<ShirtView, any | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  //--------------------------------------------------
  // Create Fabric canvas once
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

    void loadView("front");

    return () => {
      canvas.dispose();
    };
  }, []);

  //--------------------------------------------------
  // Switch shirt side
  //--------------------------------------------------

  useEffect(() => {
    if (!canvasRef.current) return;

    if (currentView === previousViewRef.current) return;

    void switchView(currentView);
  }, [currentView]);

  //--------------------------------------------------
  // Save current side and load next
  //--------------------------------------------------

  async function switchView(view: ShirtView) {
    const canvas = canvasRef.current!;

    const json = canvas.toJSON();

    json.objects = json.objects.filter(
      (obj: any) => !obj.data?.isShirt
    );

    designsRef.current[previousViewRef.current] = json;

    await loadView(view);

    previousViewRef.current = view;
  }

  //--------------------------------------------------
  // Load one shirt side
  //--------------------------------------------------

  async function loadView(view: ShirtView) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.clear();

    canvas.backgroundColor = "#e5e7eb";

    // Restore saved design first
    const saved = designsRef.current[view];

    if (saved) {
      await canvas.loadFromJSON(saved);
    }

    // Add shirt last
    const shirt = await FabricImage.fromURL(
      shirtAssets.tshirt.white[view]
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

    shirt.data = {
      isShirt: true,
    };

    canvas.add(shirt);

    // Shirt should stay behind everything
    canvas.moveObjectTo(shirt, 0);

    canvas.renderAll();
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
  // Public API
  //--------------------------------------------------

  useImperativeHandle(ref, () => ({
    addImage,
  }));

  return canvasElementRef;
}