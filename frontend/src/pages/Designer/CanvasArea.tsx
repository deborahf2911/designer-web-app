import { forwardRef } from "react";

import { useFabricDesigner } from "../../pages/Designer/useFabricDesigner";

import type { ShirtView } from "../../types/designer";
import type { FabricDesignerHandle } from "../../pages/Designer/useFabricDesigner";

interface Props {
  currentView: ShirtView;
}

const CanvasArea = forwardRef<FabricDesignerHandle, Props>(
  ({ currentView }, ref) => {
    const canvasRef = useFabricDesigner(currentView, ref);

    return (
      <main className="flex flex-1 items-center justify-center bg-gray-200">
        <canvas ref={canvasRef} />
      </main>
    );
  }
);

CanvasArea.displayName = "CanvasArea";

export default CanvasArea;