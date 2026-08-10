import {
  forwardRef,
} from "react";

import type { Product } from "../../types/product";
import type { ProductColor } from "../../types/productColor";
import type { ProductView } from "../../types/designer";
import type {
  FabricDesignerHandle,
} from "../../features/designer/hooks/useFabricDesigner";
import type { TextStyle } from "../../features/designer/models/textStyle";
import { useFabricDesigner } from "../../features/designer/hooks/useFabricDesigner";

interface CanvasAreaProps {
  product: Product;
  currentView: ProductView;
  productColor: ProductColor;

  onSelectionChange?: (
    isSelected: boolean
  ) => void;

  onTextStyleChange?: (
    style: TextStyle
  ) => void;
}

const CanvasArea = forwardRef<
  FabricDesignerHandle,
  CanvasAreaProps
>(
  (
    {
      product,
      currentView,
      productColor,
      onSelectionChange,
      onTextStyleChange,
    },
    ref
  ) => {
    const canvasRef =
      useFabricDesigner(
        product,
        currentView,
        productColor,
        ref,
        onSelectionChange,
        onTextStyleChange
      );

    return (
      <main className="flex flex-1 items-center justify-center bg-gray-200">
        <canvas ref={canvasRef} />
      </main>
    );
  }
);

CanvasArea.displayName =
  "CanvasArea";

export default CanvasArea;