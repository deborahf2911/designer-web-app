import { forwardRef } from "react";

import { useFabricDesigner } from "../../features/designer/hooks/useFabricDesigner";

import type { ProductView } from "../../types/designer";
import type { FabricDesignerHandle } from "../../features/designer/hooks/useFabricDesigner";
import type { ProductColor } from "../../types/productColor";

import type { Product } from "../../types/product";

interface Props {
    product: Product;

    currentView: ProductView;

    productColor: ProductColor;
}

const CanvasArea = forwardRef<FabricDesignerHandle, Props>(
  ({ product, currentView, productColor }, ref) => {
    const canvasRef = useFabricDesigner(
      product,
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