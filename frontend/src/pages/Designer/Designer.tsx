import { useRef, useState } from "react";

import Sidebar from "../../components/designer/Sidebar/Sidebar";
import CanvasArea from "./CanvasArea";

import type { ShirtView } from "../../types/designer";
import type { FabricDesignerHandle } from "./useFabricDesigner";

export default function Designer() {
  const [currentView, setCurrentView] =
    useState<ShirtView>("front");

  const canvasRef = useRef<FabricDesignerHandle>(null);

  return (
    <div className="flex h-screen">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onImageUpload={(file) =>
          void canvasRef.current?.addImage(file)
        }
      />

      <CanvasArea
        ref={canvasRef}
        currentView={currentView}
      />
    </div>
  );
}