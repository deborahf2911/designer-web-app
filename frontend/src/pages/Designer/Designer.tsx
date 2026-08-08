import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../../components/designer/Sidebar/Sidebar";
import CanvasArea from "./CanvasArea";

import {
  DesignProvider,
  useDesign,
} from "../../features/designer/context/DesignContext";

import type { FabricDesignerHandle } from "../../features/designer/hooks/useFabricDesigner";

import { products } from "../../data/products";

function DesignerContent() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();

  const canvasRef = useRef<FabricDesignerHandle>(null);

  const {
    design,
    setProduct,
    setColor,
    setCurrentView,
    setSize,
  } = useDesign();

  const product =
    products.find((p) => p.id === Number(productId)) ??
    products[0];

  const selectedColor =
    location.state?.color ?? product.colors[0];

  const selectedSize =
    location.state?.size ?? product.sizes[0];

  useEffect(() => {
    setProduct(product);
    setColor(selectedColor);
    setSize(selectedSize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-gray-100">

      {/* LEFT SIDEBAR */}
      <Sidebar
        product={design.product}
        currentView={design.currentView}
        productColor={design.color}
        onColorChange={setColor}
        onViewChange={setCurrentView}
        onImageUpload={(file) =>
          void canvasRef.current?.addImage(file)
        }
        onDeleteSelected={() =>
          canvasRef.current?.deleteSelected()
        }
      />

      {/* RIGHT SIDE */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* PRODUCT HEADER */}
        <div className="shrink-0 border-b bg-white px-8 py-4">

          <button
            onClick={() =>
              navigate(`/product/${design.product.id}`)
            }
            className="mb-3 flex items-center gap-2 text-sm text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={18} />
            Back to Product
          </button>

          <h1 className="text-2xl font-bold">
            {design.product.name}
          </h1>

          <p className="text-gray-500">
            {design.color.toUpperCase()} • Size {design.size}
          </p>

        </div>

        {/* CANVAS */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-gray-200 p-4">

          <CanvasArea
            product={design.product}
            currentView={design.currentView}
            productColor={design.color}
            ref={canvasRef}
          />

        </div>

        {/* SAVE BUTTON */}
        <div className="shrink-0 border-t bg-white p-4">

          <button
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Save Design & Continue
          </button>

        </div>

      </div>
    </div>
  );
}

export default function Designer() {
  return (
    <DesignProvider>
      <DesignerContent />
    </DesignProvider>
  );
}