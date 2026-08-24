import {
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { ArrowLeft } from "lucide-react";

import Sidebar from "../../components/designer/Sidebar/Sidebar";
import CanvasArea from "./CanvasArea";

import {
  DesignProvider,
  useDesign,
} from "../../features/designer/context/DesignContext";

import type { FabricDesignerHandle } from "../../features/designer/hooks/useFabricDesigner";
import type { ProductColor } from "../../types/productColor";
import type { TextStyle } from "../../features/designer/models/textStyle";

import { useCart } from "../../contexts/CartContext";
import { customizationPricing } from "../../data/customizationPricing";

import { products } from "../../data/products";
import { productAssets } from "../../features/designer/config/productAssets";

// interface DesignerLocationState {
//   color?: ProductColor;
//   size?: string;
// }

function DesignerContent() {
  const navigate = useNavigate();

  const { productId } = useParams();

  const [searchParams] = useSearchParams();

  const { addItem } = useCart();

  const canvasRef =
    useRef<FabricDesignerHandle | null>(null);

  const [textSelected, setTextSelected] =
  useState(false);

  const designPreview =
  canvasRef.current?.getPreview() ?? undefined;

  const [textStyle, setTextStyle] =
    useState<TextStyle>({
      fill: "#000000",
      fontFamily: "Arial",
      fontWeight: "normal",
      fontStyle: "normal",
      underline: false,
      fontSize: 40,
    });

  const {
    design,
    setProduct,
    setColor,
    setCurrentView,
    setSize,
  } = useDesign();

  const urlQuantity =
  searchParams.get("quantity");

  const quantity =
    Math.max(
      1,
      Number(urlQuantity) || 1
    );

  // -----------------------------------------
  // Find product
  // -----------------------------------------

  const product =
    products.find(
      (p) => p.id === Number(productId)
    ) ?? products[0];

  // -----------------------------------------
  // Read state from Product page
  // -----------------------------------------

  const urlColor =
  searchParams.get("color");

  const urlSize =
    searchParams.get("size");

  const selectedColor: ProductColor =
    product.colors.includes(
      urlColor as ProductColor
    )
      ? (urlColor as ProductColor)
      : product.colors[0];

  const selectedSize =
    product.sizes.includes(
      urlSize ?? ""
    )
      ? urlSize!
      : product.sizes[0];

  // -----------------------------------------
  // Initialise designer
  // -----------------------------------------

  useEffect(() => {
    setProduct(product);
    setColor(selectedColor);
    setSize(selectedSize);
  }, [
    product,
    selectedColor,
    selectedSize
  ]);

  function handleSaveAndContinue() {
    const summary =
      canvasRef.current
        ?.getCustomizationSummary();

    if (!summary) {
      return;
    }

    const textPrice =
      summary.textCount *
      customizationPricing.text;

    const imagePrice =
      summary.imageCount *
      customizationPricing.image;

    const fontPrice =
      summary.premiumFontUsed
        ? customizationPricing.premiumFont
        : 0;

    const customizationPrice =
      textPrice +
      imagePrice +
      fontPrice;

    const unitPrice =
      product.price +
      customizationPrice;

    const selectedProductImage =
    productAssets[product.type][design.color].front;

    addItem({
      id: crypto.randomUUID(),

      productId: product.id,
      productName: product.name,
      productImage: selectedProductImage,

      designPreview,

      color: design.color,
      size: design.size,
      quantity,

      basePrice: product.price,

      customized: true,

      customization: summary,

      customizationPrice,

      unitPrice,
    });

    navigate("/cart");
  }

  // -----------------------------------------
  // Render
  // -----------------------------------------

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-gray-100">

      {/* =====================================
          LEFT SIDEBAR
      ===================================== */}

      <Sidebar
        currentView={design.currentView}
        productColor={design.color}

        textSelected={textSelected}

        textStyle={textStyle}

        onColorChange={setColor}
        onViewChange={setCurrentView}

        onImageUpload={(file) => {
          void canvasRef.current?.addImage(file);
        }}

        onDeleteSelected={() => {
          canvasRef.current?.deleteSelected();
        }}

        onTextAdd={(text) => {
          canvasRef.current?.addText(text);
        }}

        onTextColorChange={(color) => {
          canvasRef.current?.updateSelectedTextColor(color);

          setTextStyle((previous) => ({
            ...previous,
            fill: color,
          }));
        }}

        onFontChange={(font) => {
          canvasRef.current?.updateSelectedFont(font);

          setTextStyle((previous) => ({
            ...previous,
            fontFamily: font,
          }));
        }}

        onBold={() => {
          canvasRef.current?.toggleBold();

          setTextStyle((previous) => ({
            ...previous,
            fontWeight:
              previous.fontWeight === "bold"
                ? "normal"
                : "bold",
          }));
        }}

        onItalic={() => {
          canvasRef.current?.toggleItalic();

          setTextStyle((previous) => ({
            ...previous,
            fontStyle:
              previous.fontStyle === "italic"
                ? "normal"
                : "italic",
          }));
        }}

        onUnderline={() => {
          canvasRef.current?.toggleUnderline();

          setTextStyle((previous) => ({
            ...previous,
            underline: !previous.underline,
          }));
        }}

        onFontSizeChange={(amount) => {
          canvasRef.current?.changeFontSize(amount);

          setTextStyle((previous) => ({
            ...previous,
            fontSize: Math.max(
              8,
              Math.min(
                150,
                previous.fontSize + amount
              )
            ),
          }));
        }}
      />

      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* PRODUCT HEADER */}

        <div className="shrink-0 border-b bg-white px-8 py-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/product/${design.product.id}`
              )
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
            {design.color.toUpperCase()} • Size{" "}
            {design.size}
          </p>

        </div>

        {/* CANVAS */}

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-gray-200 p-4">

          <CanvasArea
            product={design.product}
            currentView={design.currentView}
            productColor={design.color}
            ref={canvasRef}
            onSelectionChange={(isSelected) => {
              setTextSelected(isSelected);

              if (isSelected) {
                const style =
                  canvasRef.current?.getSelectedTextStyle();

                if (style) {
                  setTextStyle(style);
                }
              }
            }}
            onTextStyleChange={setTextStyle}
          />

        </div>

        {/* SAVE */}

        <div className="shrink-0 border-t bg-white p-4">

          <button
            type="button"
            onClick={handleSaveAndContinue}
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