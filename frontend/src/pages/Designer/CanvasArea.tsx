import { forwardRef } from "react";

import { useFabricDesigner } from "../../pages/Designer/useFabricDesigner";

import type { ProductView } from "../../types/designer";
import type { FabricDesignerHandle } from "../../pages/Designer/useFabricDesigner";
import type { ProductColor } from "../../types/productColor";

interface Props {
  currentView: ProductView;
  productColor: ProductColor;
}

const CanvasArea = forwardRef<FabricDesignerHandle, Props>(
  ({ currentView, productColor }, ref) => {
    const canvasRef = useFabricDesigner(
      currentView,
      productColor,
      ref
    );

    return (
      <main className="flex flex-1 items-center justify-center bg-gray-200">
        <canvas ref={canvasRef} />
      </main>
    );
  }
);

CanvasArea.displayName = "CanvasArea";

export default CanvasArea;