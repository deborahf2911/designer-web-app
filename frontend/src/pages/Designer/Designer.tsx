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

import {
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../../components/designer/Sidebar/Sidebar";
import CanvasArea from "./CanvasArea";

import {
  DesignProvider,
  useDesign,
} from "../../features/designer/context/DesignContext";

import type {
  FabricDesignerHandle,
} from "../../features/designer/hooks/useFabricDesigner";

import type {
  ProductColor,
} from "../../types/productColor";

import type {
  ProductView,
} from "../../types/designer";

import type {
  TextStyle,
} from "../../features/designer/models/textStyle";

import {
  useCart,
} from "../../contexts/CartContext";

import {
  useAuth,
} from "../../contexts/AuthContext";

import {
  customizationPricing,
} from "../../data/customizationPricing";

import {
  products,
} from "../../data/products";

import {
  productAssets,
} from "../../features/designer/config/productAssets";

import {
  getSavedDesign,
  saveDesign,
  updateDesign,
} from "../../services/designService";

import {
  getGuestDesign,
  saveGuestDesign,
  type GuestDesignRecord,
} from "../../services/guestDesignService";

// =========================================================
// TYPES
// =========================================================

interface LoadedDesign {
  color: ProductColor;

  size: string;

  quantity: number;

  current_view: ProductView;

  front_design: any[];

  back_design: any[];

  left_design: any[];

  right_design: any[];
}

// =========================================================
// DESIGNER
// =========================================================

function DesignerContent() {
  const navigate =
    useNavigate();

  const {
    productId,
  } =
    useParams();

  const [
    searchParams,
  ] =
    useSearchParams();

  const {
    addItem,
    updateItem,
  } =
    useCart();

  const {
    user,
  } =
    useAuth();

  const canvasRef =
    useRef<
      FabricDesignerHandle | null
    >(null);

  // =========================================================
  // URL
  // =========================================================

  const designId =
    searchParams.get(
      "designId"
    );

  const isEditing =
    Boolean(
      designId
    );

  const isGuestDesign =
    designId?.startsWith(
      "guest-"
    ) ??
    false;

  // =========================================================
  // STATE
  // =========================================================

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );

  const [
    loadingDesign,
    setLoadingDesign,
  ] =
    useState(
      Boolean(
        designId
      )
    );

  const [
    saveError,
    setSaveError,
  ] =
    useState(
      ""
    );

  const [
    loadError,
    setLoadError,
  ] =
    useState(
      ""
    );

  const [
    textSelected,
    setTextSelected,
  ] =
    useState(
      false
    );

  const [
    savedDesign,
    setSavedDesign,
  ] =
    useState<
      LoadedDesign | null
    >(
      null
    );

  const [
    savedDesignLoadedIntoCanvas,
    setSavedDesignLoadedIntoCanvas,
  ] =
    useState(
      false
    );

  const [
    quantity,
    setQuantity,
  ] =
    useState(
      1
    );

  const [
    textStyle,
    setTextStyle,
  ] =
    useState<TextStyle>({
      fill:
        "#000000",

      fontFamily:
        "Arial",

      fontWeight:
        "normal",

      fontStyle:
        "normal",

      underline:
        false,

      fontSize:
        40,
    });

  const {
    design,

    setProduct,
    setColor,
    setCurrentView,
    setSize,
  } =
    useDesign();

  // =========================================================
  // PRODUCT
  // =========================================================

  const product =
    products.find(
      (
        item
      ) =>
        item.id ===
        Number(
          productId
        )
    ) ??
    products[0];

  // =========================================================
  // URL VALUES
  // =========================================================

  const urlColor =
    searchParams.get(
      "color"
    );

  const urlSize =
    searchParams.get(
      "size"
    );

  const urlQuantity =
    searchParams.get(
      "quantity"
    );

  const selectedColor:
    ProductColor =
    product.colors.includes(
      urlColor as
        ProductColor
    )
      ? (
          urlColor as
            ProductColor
        )
      : product.colors[
          0
        ];

  /*
   * Handles products such as the Cap where
   * the old URL could contain size=undefined.
   */
  const selectedSize =
    urlSize &&
    urlSize !==
      "undefined" &&
    product.sizes.includes(
      urlSize
    )
      ? urlSize
      : product.sizes[
          0
        ];

  // =========================================================
  // INITIALISE NEW DESIGN
  // =========================================================

  useEffect(() => {
    if (
      designId
    ) {
      return;
    }

    setProduct(
      product
    );

    setColor(
      selectedColor
    );

    setSize(
      selectedSize
    );

    setCurrentView(
      "front"
    );

    setQuantity(
      Math.max(
        1,
        Number(
          urlQuantity
        ) ||
          1
      )
    );

    setSavedDesign(
      null
    );

    setSavedDesignLoadedIntoCanvas(
      false
    );
  }, [
    designId,
    product,
    selectedColor,
    selectedSize,
    urlQuantity,
  ]);

  // =========================================================
  // LOAD EXISTING DESIGN
  //
  // guest-* → IndexedDB
  // normal UUID → Supabase
  // =========================================================

  useEffect(() => {
    if (
      !designId
    ) {
      return;
    }

    const currentDesignId =
      designId;

    let cancelled =
      false;

    async function load() {
      setLoadingDesign(
        true
      );

      setLoadError(
        ""
      );

      setSavedDesignLoadedIntoCanvas(
        false
      );

      try {
        // ===================================================
        // GUEST
        // ===================================================

        if (
          currentDesignId.startsWith(
            "guest-"
          )
        ) {
          const guest =
            await getGuestDesign(
              currentDesignId
            );

          if (
            !guest
          ) {
            throw new Error(
              "This guest design is no longer available."
            );
          }

          const normalized:
            LoadedDesign = {
              color:
                guest.color,

              size:
                guest.size,

              quantity:
                guest.quantity,

              current_view:
                guest.currentView,

              front_design:
                guest.designData.front,

              back_design:
                guest.designData.back,

              left_design:
                guest.designData.left,

              right_design:
                guest.designData.right,
            };

          if (
            cancelled
          ) {
            return;
          }

          setSavedDesign(
            normalized
          );

          setProduct(
            product
          );

          setColor(
            normalized.color
          );

          setSize(
            normalized.size
          );

          setQuantity(
            Math.max(
              1,
              normalized.quantity
            )
          );

          setCurrentView(
            normalized.current_view
          );

          return;
        }

        // ===================================================
        // SIGNED-IN SAVED DESIGN
        // ===================================================

        const data =
          await getSavedDesign(
            currentDesignId
          );

        if (
          cancelled
        ) {
          return;
        }

        const normalized:
          LoadedDesign = {
            color:
              data.color,

            size:
              data.size,

            quantity:
              data.quantity,

            current_view:
              data.current_view ??
              "front",

            front_design:
              data.front_design ??
              [],

            back_design:
              data.back_design ??
              [],

            left_design:
              data.left_design ??
              [],

            right_design:
              data.right_design ??
              [],
          };

        setSavedDesign(
          normalized
        );

        setProduct(
          product
        );

        setColor(
          normalized.color
        );

        setSize(
          normalized.size
        );

        setQuantity(
          Math.max(
            1,
            normalized.quantity
          )
        );

        setCurrentView(
          normalized.current_view
        );
      } catch (
        error
      ) {
        console.error(
          "Unable to load saved design:",
          error
        );

        if (
          !cancelled
        ) {
          setLoadError(
            error instanceof
              Error
              ? error.message
              : "Unable to load this design."
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoadingDesign(
            false
          );
        }
      }
    }

    void load();

    return () => {
      cancelled =
        true;
    };
  }, [
    designId,
    product,
  ]);

  // =========================================================
  // LOAD FABRIC DATA
  // =========================================================

  useEffect(() => {
    if (
      !savedDesign ||
      savedDesignLoadedIntoCanvas
    ) {
      return;
    }

    if (
      design.color !==
        savedDesign.color ||
      design.size !==
        savedDesign.size ||
      design.currentView !==
        savedDesign.current_view
    ) {
      return;
    }

    const designer =
      canvasRef.current;

    if (
      !designer
    ) {
      return;
    }

    const designData = {
      front:
        savedDesign.front_design,

      back:
        savedDesign.back_design,

      left:
        savedDesign.left_design,

      right:
        savedDesign.right_design,
    };

    void designer
      .loadDesignData(
        designData as any,
        savedDesign.current_view
      )
      .then(
        () => {
          setSavedDesignLoadedIntoCanvas(
            true
          );
        }
      )
      .catch(
        (
          error
        ) => {
          console.error(
            "Unable to restore canvas:",
            error
          );

          setLoadError(
            "Unable to restore this saved design."
          );
        }
      );
  }, [
    savedDesign,
    savedDesignLoadedIntoCanvas,
    design.color,
    design.size,
    design.currentView,
  ]);

  // =========================================================
  // SAVE / UPDATE
  // =========================================================

  async function handleSaveAndContinue() {
    if (
      saving
    ) {
      return;
    }

    setSaveError(
      ""
    );

    const designer =
      canvasRef.current;

    if (
      !designer
    ) {
      setSaveError(
        "The designer is not ready yet."
      );

      return;
    }

    setSaving(
      true
    );

    try {
      // =====================================================
      // WAIT FOR AUTHENTICATED UPLOADS
      // =====================================================

      await designer
        .waitForPendingUploads();

      // =====================================================
      // DESIGN DATA
      // =====================================================

      const designData =
        designer
          .getDesignData();

      // =====================================================
      // PREVIEWS
      //
      // These are individual customized-side previews.
      // Example:
      // {
      //   front: "...",
      //   back: "..."
      // }
      // =====================================================

      const previews =
        await designer
          .getAllPreviews();

      const designPreview =
        previews.front ??
        previews[
          design.currentView
        ] ??
        Object.values(
          previews
        )[0] ??
        designer.getPreview();

      if (
        !designPreview
      ) {
        throw new Error(
          "Unable to generate a design preview."
        );
      }

      // =====================================================
      // CUSTOMIZATION SUMMARY
      // =====================================================

      const summary =
        designer
          .getCustomizationSummary();

      // =====================================================
      // PRICING
      // =====================================================

      const textPrice =
        summary.textCount *
        customizationPricing.text;

      const imagePrice =
        summary.imageCount *
        customizationPricing.image;

      const fontPrice =
        summary.premiumFontUsed
          ? customizationPricing
              .premiumFont
          : 0;

      const customizationPrice =
        textPrice +
        imagePrice +
        fontPrice;

      const unitPrice =
        product.price +
        customizationPrice;

      // =====================================================
      // ID
      // =====================================================

      const finalDesignId:
        string =
        designId
          ? designId
          : user
            ? crypto.randomUUID()
            : `guest-${crypto.randomUUID()}`;

      // =====================================================
      // PERSIST
      // =====================================================

      if (
        user &&
        !isGuestDesign
      ) {
        // ===================================================
        // SIGNED-IN USER → SUPABASE
        // ===================================================

        if (
          isEditing
        ) {
          await updateDesign({
            id:
              finalDesignId,

            userId:
              user.id,

            productId:
              product.id,

            productName:
              product.name,

            color:
              design.color,

            size:
              design.size,

            quantity,

            currentView:
              design.currentView,

            designData,

            previews,

            customizationPrice,
          });
        } else {
          await saveDesign({
            id:
              finalDesignId,

            userId:
              user.id,

            productId:
              product.id,

            productName:
              product.name,

            color:
              design.color,

            size:
              design.size,

            quantity,

            currentView:
              design.currentView,

            designData,

            previews,

            customizationPrice,
          });
        }
      } else {
        // ===================================================
        // GUEST → INDEXEDDB
        // ===================================================

        const guestRecord:
          GuestDesignRecord = {
            id:
              finalDesignId,

            productId:
              product.id,

            productName:
              product.name,

            color:
              design.color,

            size:
              design.size,

            quantity,

            currentView:
              design.currentView,

            designData: {
              front:
                designData.front,

              back:
                designData.back,

              left:
                designData.left,

              right:
                designData.right,
            },

            customizationPrice,

            updatedAt:
              new Date()
                .toISOString(),
          };

        await saveGuestDesign(
          guestRecord
        );
      }

      // =====================================================
      // PRODUCT IMAGE
      // =====================================================

      const selectedProductImage =
        productAssets[
          product.type
        ]?.[
          design.color
        ]?.front ??
        product.image;

      // =====================================================
      // CART ITEM
      //
      // Store both:
      //
      // designPreview  = one thumbnail for Cart / Checkout
      // designPreviews = all customized-side previews
      // =====================================================

      const cartItem = {
        id:
          finalDesignId,

        productId:
          product.id,

        productName:
          product.name,

        productImage:
          selectedProductImage,

        designPreview,

        designPreviews:
          previews,

        color:
          design.color,

        size:
          design.size,

        quantity,

        basePrice:
          product.price,

        customized:
          true,

        customization:
          summary,

        customizationPrice,

        unitPrice,
      };

      // =====================================================
      // CART
      // =====================================================

      if (
        isEditing
      ) {
        updateItem(
          finalDesignId,
          cartItem
        );
      } else {
        addItem(
          cartItem
        );
      }

      navigate(
        "/cart"
      );
    } catch (
      error
    ) {
      console.error(
        "Failed to save design:",
        error
      );

      setSaveError(
        error instanceof
          Error
          ? error.message
          : "Unable to save your design. Please try again."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (
    loadingDesign
  ) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-600">
            Loading your design...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (
    loadError
  ) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 px-6">

        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center">

          <p className="text-red-600">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/cart"
              )
            }
            className="mt-5 rounded-lg bg-black px-6 py-3 text-white"
          >
            Back to Cart
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-gray-100">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        product={
          design.product
        }

        currentView={
          design.currentView
        }

        productColor={
          design.color
        }

        textSelected={
          textSelected
        }

        textStyle={
          textStyle
        }

        onColorChange={
          setColor
        }

        onViewChange={
          setCurrentView
        }

        onImageUpload={(
          file
        ) => {
          setSaveError(
            ""
          );

          void canvasRef
            .current
            ?.addImage(
              file,
              user?.id
            )
            .catch(
              (
                error
              ) => {
                console.error(
                  "Image upload failed:",
                  error
                );

                setSaveError(
                  error instanceof
                    Error
                    ? error.message
                    : "Unable to upload this image."
                );
              }
            );
        }}

        onDeleteSelected={() => {
          canvasRef
            .current
            ?.deleteSelected();
        }}

        onTextAdd={(
          text
        ) => {
          canvasRef
            .current
            ?.addText(
              text
            );
        }}

        onTextColorChange={(
          color
        ) => {
          canvasRef
            .current
            ?.updateSelectedTextColor(
              color
            );

          setTextStyle(
            (
              previous
            ) => ({
              ...previous,

              fill:
                color,
            })
          );
        }}

        onFontChange={(
          font
        ) => {
          void canvasRef
            .current
            ?.updateSelectedFont(
              font
            );

          setTextStyle(
            (
              previous
            ) => ({
              ...previous,

              fontFamily:
                font,
            })
          );
        }}

        onBold={() => {
          canvasRef
            .current
            ?.toggleBold();

          setTextStyle(
            (
              previous
            ) => ({
              ...previous,

              fontWeight:
                previous.fontWeight ===
                "bold"
                  ? "normal"
                  : "bold",
            })
          );
        }}

        onItalic={() => {
          canvasRef
            .current
            ?.toggleItalic();

          setTextStyle(
            (
              previous
            ) => ({
              ...previous,

              fontStyle:
                previous.fontStyle ===
                "italic"
                  ? "normal"
                  : "italic",
            })
          );
        }}

        onUnderline={() => {
          canvasRef
            .current
            ?.toggleUnderline();

          setTextStyle(
            (
              previous
            ) => ({
              ...previous,

              underline:
                !previous
                  .underline,
            })
          );
        }}

        onFontSizeChange={(
          amount
        ) => {
          canvasRef
            .current
            ?.changeFontSize(
              amount
            );

          setTextStyle(
            (
              previous
            ) => ({
              ...previous,

              fontSize:
                Math.max(
                  8,
                  Math.min(
                    150,
                    previous.fontSize +
                      amount
                  )
                ),
            })
          );
        }}
      />

      {/* ===================================================
          RIGHT
      =================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}

        <div className="shrink-0 border-b bg-white px-8 py-4">

          <button
            type="button"
            onClick={() => {
              if (
                isEditing
              ) {
                navigate(
                  "/cart"
                );
              } else {
                navigate(
                  `/product/${design.product.id}`
                );
              }
            }}
            className="mb-3 flex items-center gap-2 text-sm text-gray-600 transition hover:text-black"
          >
            <ArrowLeft
              size={
                18
              }
            />

            {isEditing
              ? "Back to Cart"
              : "Back to Product"}
          </button>

          <h1 className="text-2xl font-bold">
            {
              design.product
                .name
            }
          </h1>

          <p className="text-gray-500">
            {design.color.toUpperCase()}

            {" • "}

            Size{" "}

            {design.size}
          </p>

        </div>

        {/* CANVAS */}

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-gray-200 p-4">

          {design.product.id ===
          product.id ? (

            <CanvasArea
              key={
                design.product.id
              }

              product={
                design.product
              }

              currentView={
                design.currentView
              }

              productColor={
                design.color
              }

              ref={
                canvasRef
              }

              onSelectionChange={(
                isSelected
              ) => {
                setTextSelected(
                  isSelected
                );

                if (
                  isSelected
                ) {
                  const style =
                    canvasRef
                      .current
                      ?.getSelectedTextStyle();

                  if (
                    style
                  ) {
                    setTextStyle(
                      style
                    );
                  }
                }
              }}

              onTextStyleChange={
                setTextStyle
              }
            />

          ) : (

            <div className="text-sm text-gray-500">
              Preparing designer...
            </div>

          )}

        </div>

        {/* SAVE */}

        <div className="shrink-0 border-t bg-white p-4">

          {saveError && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {saveError}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              void handleSaveAndContinue()
            }
            disabled={
              saving
            }
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? isEditing
                ? "Updating Design..."
                : "Saving Design..."
              : isEditing
                ? "Update Design & Continue"
                : "Save Design & Continue"}
          </button>

        </div>

      </div>

    </div>
  );
}

// =========================================================
// PAGE
// =========================================================

export default function Designer() {
  return (
    <DesignProvider>
      <DesignerContent />
    </DesignProvider>
  );
}