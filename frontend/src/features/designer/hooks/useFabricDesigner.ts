import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
} from "react";

import {
  Canvas,
  FabricImage,
  IText,
  type FabricObject,
} from "fabric";

import type { ProductView } from "../../../types/designer";
import type { ProductColor } from "../../../types/productColor";
import { productAssets } from "../config/productAssets";
import { productDisplay } from "../config/productDisplay";
import type { Product } from "../../../types/product";
import type { TextStyle } from "../models/textStyle";

export interface FabricDesignerHandle {
  addImage(file: File): Promise<void>;
  addText(text: string): void;
  deleteSelected(): void;

  updateSelectedTextColor(color: string): void;
  updateSelectedFont(fontFamily: string): void;

  toggleBold(): void;
  toggleItalic(): void;
  toggleUnderline(): void;

  changeFontSize(amount: number): void;

  getSelectedTextStyle(): TextStyle | null;
}

export function useFabricDesigner(
  product: Product,
  currentView: ProductView,
  productColor: ProductColor,
  ref: ForwardedRef<FabricDesignerHandle>,
  onSelectionChange?: (
    isTextSelected: boolean
  ) => void,
  onTextStyleChange?: (
    style: TextStyle
  ) => void
) {
  // =========================================================
  // REFS
  // =========================================================

  const canvasElementRef =
    useRef<HTMLCanvasElement>(null);

  const canvasRef =
    useRef<Canvas | null>(null);

  const selectedTextRef =
    useRef<IText | null>(null);

  const productRef =
    useRef<FabricImage | null>(null);

  const previousViewRef =
    useRef<ProductView>("front");

  const onSelectionChangeRef =
    useRef(onSelectionChange);

  const onTextStyleChangeRef =
    useRef(onTextStyleChange);

  const designsRef = useRef<
    Record<
      ProductView,
      ReturnType<FabricObject["toObject"]>[]
    >
  >({
    front: [],
    back: [],
    left: [],
    right: [],
  });

  // =========================================================
  // KEEP CALLBACKS UPDATED
  // =========================================================

  useEffect(() => {
    onSelectionChangeRef.current =
      onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    onTextStyleChangeRef.current =
      onTextStyleChange;
  }, [onTextStyleChange]);

  // =========================================================
  // TEXT STYLE HELPER
  // =========================================================

  function getTextStyle(
    textObject: IText
  ): TextStyle {
    return {
      fontFamily:
        textObject.fontFamily ?? "Arial",

      fontWeight:
        textObject.fontWeight === "bold"
          ? "bold"
          : "normal",

      fontStyle:
        textObject.fontStyle === "italic"
          ? "italic"
          : "normal",

      underline:
        textObject.underline ?? false,

      fill:
        typeof textObject.fill === "string"
          ? textObject.fill
          : "#000000",

      fontSize:
        textObject.fontSize ?? 40,
    };
  }

  // =========================================================
  // CHECK WHETHER OBJECT IS TEXT
  // =========================================================

  function isTextObject(
    object: FabricObject | null
  ): object is IText {
    return object instanceof IText;
  }

  // =========================================================
  // NOTIFY TEXT SELECTION
  // =========================================================

  function selectText(
    textObject: IText
  ) {
    selectedTextRef.current =
      textObject;

    onSelectionChangeRef.current?.(
      true
    );

    onTextStyleChangeRef.current?.(
      getTextStyle(textObject)
    );
  }

  // =========================================================
  // CLEAR TEXT SELECTION
  // =========================================================

  function clearTextSelection() {
    selectedTextRef.current = null;

    onSelectionChangeRef.current?.(
      false
    );
  }

  // =========================================================
  // CREATE CANVAS
  // =========================================================

  useEffect(() => {
    if (!canvasElementRef.current) {
      return;
    }

    const canvas = new Canvas(
      canvasElementRef.current,
      {
        width: 700,
        height: 700,
        backgroundColor: "#e5e7eb",
        preserveObjectStacking: true,
      }
    );

    canvasRef.current = canvas;

    // =======================================================
    // SELECTION HANDLER
    // =======================================================

    const updateSelection = () => {
      const activeObject =
        canvas.getActiveObject();

      if (
        activeObject &&
        isTextObject(activeObject)
      ) {
        selectText(activeObject);
      } else {
        clearTextSelection();
      }
    };

    // =======================================================
    // SELECTION CREATED
    // =======================================================

    canvas.on(
      "selection:created",
      updateSelection
    );

    // =======================================================
    // SELECTION UPDATED
    // =======================================================

    canvas.on(
      "selection:updated",
      updateSelection
    );

    // =======================================================
    // SELECTION CLEARED
    // =======================================================

    const handleSelectionCleared = () => {
      clearTextSelection();
    };

    canvas.on(
      "selection:cleared",
      handleSelectionCleared
    );

    // =======================================================
    // MOUSE DOWN
    //
    // IMPORTANT:
    // Use instanceof IText instead of
    // target.type === "IText"
    // =======================================================

    const handleMouseDown = (
      event: any
    ) => {
      const target =
        event.target;

      if (
        target &&
        isTextObject(target)
      ) {
        selectText(target);
      }
    };

    canvas.on(
      "mouse:down",
      handleMouseDown
    );

    // =======================================================
    // INITIAL PRODUCT
    // =======================================================

    void loadProduct(
      currentView,
      productColor
    );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      canvas.off(
        "selection:created",
        updateSelection
      );

      canvas.off(
        "selection:updated",
        updateSelection
      );

      canvas.off(
        "selection:cleared",
        handleSelectionCleared
      );

      canvas.off(
        "mouse:down",
        handleMouseDown
      );

      canvas.dispose();

      canvasRef.current = null;
    };
  }, []);

  // =========================================================
  // CHANGE SIDE
  // =========================================================

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (
      currentView ===
      previousViewRef.current
    ) {
      return;
    }

    void switchSide(currentView);
  }, [currentView]);

  // =========================================================
  // CHANGE COLOR
  // =========================================================

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    void updateProductColor(
      currentView,
      productColor
    );
  }, [productColor]);

  // =========================================================
  // SAVE CURRENT DESIGN
  // =========================================================

  function saveCurrentDesign(
    side: ProductView
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const objects = canvas
      .getObjects()
      .filter(
        (obj) =>
          !(obj as any).data
            ?.isProduct
      );

    designsRef.current[side] =
      objects.map((obj) =>
        obj.toObject(["data"])
      );
  }

  // =========================================================
  // RESTORE DESIGN
  // =========================================================

  async function restoreDesign(
    side: ProductView
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const objects =
      designsRef.current[side];

    for (
      const objectData of objects
    ) {
      // =====================================================
      // SKIP PRODUCT
      // =====================================================

      if (
        (objectData as any).data
          ?.isProduct
      ) {
        continue;
      }

      // =====================================================
      // IMAGE
      // =====================================================

      if (
        objectData.type ===
          "Image" &&
        (objectData as any).src
      ) {
        const image =
          await FabricImage.fromURL(
            (objectData as any).src
          );

        image.set({
          left:
            objectData.left,
          top:
            objectData.top,
          scaleX:
            objectData.scaleX,
          scaleY:
            objectData.scaleY,
          angle:
            objectData.angle,
          originX:
            objectData.originX,
          originY:
            objectData.originY,

          selectable: true,
          evented: true,
        });

        canvas.add(image);

        continue;
      }

      // =====================================================
      // TEXT
      // =====================================================

      if (
        objectData.type ===
        "IText"
      ) {
        const textObject =
          new IText(
            (objectData as any)
              .text ?? "",
            {
              left:
                objectData.left,

              top:
                objectData.top,

              scaleX:
                objectData.scaleX,

              scaleY:
                objectData.scaleY,

              angle:
                objectData.angle,

              originX:
                objectData.originX,

              originY:
                objectData.originY,

              fontSize:
                (objectData as any)
                  .fontSize ?? 40,

              fill:
                typeof (
                  objectData as any
                ).fill === "string"
                  ? (
                      objectData as any
                    ).fill
                  : "#000000",

              fontFamily:
                (objectData as any)
                  .fontFamily ??
                "Arial",

              fontWeight:
                (
                  objectData as any
                ).fontWeight ===
                "bold"
                  ? "bold"
                  : "normal",

              fontStyle:
                (
                  objectData as any
                ).fontStyle ===
                "italic"
                  ? "italic"
                  : "normal",

              underline:
                (
                  objectData as any
                ).underline ??
                false,

              editable: true,
              selectable: true,
              evented: true,
            }
          );

        canvas.add(textObject);
      }
    }

    canvas.requestRenderAll();
  }

  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  async function loadProduct(
    view: ProductView,
    color: ProductColor
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    // =======================================================
    // REMOVE OLD PRODUCT
    // =======================================================

    canvas
      .getObjects()
      .forEach((obj) => {
        if (
          (obj as any).data
            ?.isProduct
        ) {
          canvas.remove(obj);
        }
      });

    // =======================================================
    // LOAD PRODUCT IMAGE
    // =======================================================

    const image =
      await FabricImage.fromURL(
        productAssets[
          product.type
        ][color][view]
      );

    const display =
      productDisplay[
        product.type
      ][view];

    image.scaleToWidth(
      display.width
    );

    image.set({
      left:
        display.left,

      top:
        display.top,

      originX:
        "center",

      originY:
        "center",

      selectable:
        false,

      evented:
        false,
    });

    (image as any).data = {
      isProduct: true,
    };

    productRef.current =
      image;

    canvas.add(image);

    canvas.moveObjectTo(
      image,
      0
    );

    canvas.requestRenderAll();
  }

  // =========================================================
  // SWITCH SIDE
  // =========================================================

  async function switchSide(
    view: ProductView
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    // Save current side
    saveCurrentDesign(
      previousViewRef.current
    );

    // Clear selection
    selectedTextRef.current =
      null;

    canvas.discardActiveObject();

    // =======================================================
    // REMOVE DESIGN OBJECTS
    // =======================================================

    canvas
      .getObjects()
      .forEach((obj) => {
        if (
          !(obj as any).data
            ?.isProduct
        ) {
          canvas.remove(obj);
        }
      });

    // =======================================================
    // LOAD PRODUCT
    // =======================================================

    await loadProduct(
      view,
      productColor
    );

    // =======================================================
    // RESTORE DESIGN
    // =======================================================

    await restoreDesign(view);

    canvas.requestRenderAll();

    previousViewRef.current =
      view;

    clearTextSelection();
  }

  // =========================================================
  // UPDATE PRODUCT COLOR
  // =========================================================

  async function updateProductColor(
    view: ProductView,
    color: ProductColor
  ) {
    await loadProduct(
      view,
      color
    );
  }

  // =========================================================
  // ADD IMAGE
  // =========================================================

  async function addImage(
    file: File
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = async () => {
      const result =
        reader.result;

      if (
        typeof result !==
        "string"
      ) {
        return;
      }

      const image =
        await FabricImage.fromURL(
          result
        );

      image.scaleToWidth(
        120
      );

      image.set({
        left: 350,
        top: 320,

        originX:
          "center",

        originY:
          "center",

        selectable:
          true,

        evented:
          true,
      });

      canvas.add(image);

      canvas.setActiveObject(
        image
      );

      canvas.requestRenderAll();
    };

    reader.readAsDataURL(file);
  }

  // =========================================================
  // ADD TEXT
  // =========================================================

  function addText(
    text: string
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const textObject =
      new IText(text, {
        left: 350,
        top: 320,

        originX:
          "center",

        originY:
          "center",

        fontSize:
          40,

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

        editable:
          true,

        selectable:
          true,

        evented:
          true,
      });

    canvas.add(
      textObject
    );

    // =======================================================
    // SELECT THE NEW TEXT
    // =======================================================

    canvas.setActiveObject(
      textObject
    );

    selectedTextRef.current =
      textObject;

    // =======================================================
    // IMPORTANT:
    // Tell React immediately that text is selected.
    // =======================================================

    selectText(
      textObject
    );

    canvas.requestRenderAll();
  }

  // =========================================================
  // GET SELECTED TEXT
  // =========================================================

  function getSelectedText():
    IText | null {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return null;
    }

    const activeObject =
      canvas.getActiveObject();

    if (
      activeObject &&
      isTextObject(activeObject)
    ) {
      selectedTextRef.current =
        activeObject;

      return activeObject;
    }

    return selectedTextRef.current;
  }

  // =========================================================
  // GET SELECTED TEXT STYLE
  // =========================================================

  function getSelectedTextStyle():
    TextStyle | null {
    const textObject =
      getSelectedText();

    if (!textObject) {
      return null;
    }

    return getTextStyle(
      textObject
    );
  }

  // =========================================================
  // REFRESH CANVAS
  // =========================================================

  function refreshCanvas() {
    canvasRef.current
      ?.requestRenderAll();
  }

  // =========================================================
  // TEXT COLOR
  // =========================================================

  function updateSelectedTextColor(
    color: string
  ) {
    const textObject =
      getSelectedText();

    if (!textObject) {
      return;
    }

    textObject.set({
      fill: color,
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  // =========================================================
  // FONT
  // =========================================================

  function updateSelectedFont(
    fontFamily: string
  ) {
    const textObject =
      getSelectedText();

    if (!textObject) {
      return;
    }

    textObject.set({
      fontFamily,
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  // =========================================================
  // BOLD
  // =========================================================

  function toggleBold() {
    const textObject =
      getSelectedText();

    if (!textObject) {
      return;
    }

    const newWeight =
      textObject.fontWeight ===
      "bold"
        ? "normal"
        : "bold";

    textObject.set({
      fontWeight:
        newWeight,
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  // =========================================================
  // ITALIC
  // =========================================================

  function toggleItalic() {
    const textObject =
      getSelectedText();

    if (!textObject) {
      return;
    }

    const newStyle =
      textObject.fontStyle ===
      "italic"
        ? "normal"
        : "italic";

    textObject.set({
      fontStyle:
        newStyle,
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  // =========================================================
  // UNDERLINE
  // =========================================================

  function toggleUnderline() {
    const textObject =
      getSelectedText();

    if (!textObject) {
      return;
    }

    textObject.set({
      underline:
        !textObject.underline,
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  // =========================================================
  // FONT SIZE
  // =========================================================

  function changeFontSize(
    amount: number
  ) {
    const textObject =
      getSelectedText();

    if (!textObject) {
      return;
    }

    const currentSize =
      textObject.fontSize ??
      40;

    const newSize =
      Math.max(
        8,
        Math.min(
          150,
          currentSize +
            amount
        )
      );

    textObject.set({
      fontSize:
        newSize,
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  // =========================================================
  // DELETE SELECTED
  // =========================================================

  function deleteSelected() {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const activeObject =
      canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    // Never delete shirt
    if (
      (activeObject as any)
        .data?.isProduct
    ) {
      return;
    }

    canvas.remove(
      activeObject
    );

    canvas.discardActiveObject();

    selectedTextRef.current =
      null;

    onSelectionChangeRef.current?.(
      false
    );

    canvas.requestRenderAll();
  }

  // =========================================================
  // KEYBOARD DELETE
  // =========================================================

  useEffect(() => {
    function handleKeyDown(
      e: KeyboardEvent
    ) {
      // Don't delete objects while typing
      // inside an input/select/textarea.
      const target =
        e.target as HTMLElement;

      if (
        target?.tagName ===
          "INPUT" ||
        target?.tagName ===
          "TEXTAREA" ||
        target?.tagName ===
          "SELECT"
      ) {
        return;
      }

      if (
        e.key !== "Delete" &&
        e.key !== "Backspace"
      ) {
        return;
      }

      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const activeObject =
        canvas.getActiveObject();

      if (!activeObject) {
        return;
      }

      if (
        (activeObject as any)
          .data?.isProduct
      ) {
        return;
      }

      e.preventDefault();

      canvas.remove(
        activeObject
      );

      canvas.discardActiveObject();

      selectedTextRef.current =
        null;

      onSelectionChangeRef.current?.(
        false
      );

      canvas.requestRenderAll();
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // =========================================================
  // EXPOSE API TO CANVAS AREA
  // =========================================================

  useImperativeHandle(
    ref,
    () => ({
      addImage,
      addText,
      deleteSelected,

      updateSelectedTextColor,
      updateSelectedFont,

      toggleBold,
      toggleItalic,
      toggleUnderline,

      changeFontSize,

      getSelectedTextStyle,
    }),
    []
  );

  // =========================================================
  // RETURN CANVAS REF
  // =========================================================

  return canvasElementRef;
}