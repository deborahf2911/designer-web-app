import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../../components/designer/Sidebar/Sidebar";
import CanvasArea from "./CanvasArea";

import type { ProductView } from "../../types/designer";
import type { FabricDesignerHandle } from "./useFabricDesigner";
import type { ProductColor } from "../../types/productColor";

export default function Designer() {
  const { productId } = useParams();

  const canvasRef = useRef<FabricDesignerHandle>(null);

  const [currentView, setCurrentView] =
    useState<ProductView>("front");

  const [productColor, setProductColor] =
    useState<ProductColor>("white");

  console.log("Product:", productId);

  return (
    <div className="flex h-screen">

      <Sidebar
        currentView={currentView}
        productColor={productColor}
        onColorChange={setProductColor}
        onViewChange={setCurrentView}
        onImageUpload={(file) =>
          void canvasRef.current?.addImage(file)
        }
      />

      <CanvasArea
        ref={canvasRef}
        currentView={currentView}
        productColor={productColor}
      />

    </div>
  );
}