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

import type {
  ProductView,
} from "../../../types/designer";

import type {
  ProductColor,
} from "../../../types/productColor";

import type {
  Product,
} from "../../../types/product";

import type {
  TextStyle,
} from "../models/textStyle";

import {
  productAssets,
} from "../config/productAssets";

import {
  productDisplay,
} from "../config/productDisplay";

import {
  getDesignAssetUrl,
  uploadDesignAsset,
} from "../../../services/designAssetService";

// =========================================================
// TYPES
// =========================================================

type SerializedFabricObject =
  ReturnType<
    FabricObject["toObject"]
  >;

type DesignData =
  Record<
    ProductView,
    SerializedFabricObject[]
  >;

// =========================================================
// HANDLE
// =========================================================

export interface FabricDesignerHandle {
  addImage(
    file: File,
    userId?: string
  ): Promise<void>;

  addText(
    text: string
  ): void;

  deleteSelected(): void;

  getPreview():
    string | null;

  getAllPreviews(): Promise<
    Partial<
      Record<
        ProductView,
        string
      >
    >
  >;

  getDesignData():
    DesignData;

  getCustomizationSummary(): {
    textCount:
      number;

    imageCount:
      number;

    premiumFontUsed:
      boolean;
  };

  updateSelectedTextColor(
    color: string
  ): void;

  updateSelectedFont(
    fontFamily: string
  ): Promise<void>;

  toggleBold(): void;

  toggleItalic(): void;

  toggleUnderline(): void;

  changeFontSize(
    amount: number
  ): void;

  getSelectedTextStyle():
    TextStyle | null;

  loadDesignData(
    designData:
      DesignData,

    initialView?:
      ProductView
  ): Promise<void>;

  waitForPendingUploads():
    Promise<void>;
}

// =========================================================
// SESSION CACHES
// =========================================================

const designAssetUrlCache =
  new Map<
    string,
    string
  >();

const designImageCache =
  new Map<
    string,
    HTMLImageElement
  >();

const designImagePromiseCache =
  new Map<
    string,
    Promise<HTMLImageElement>
  >();

const productImageCache =
  new Map<
    string,
    HTMLImageElement
  >();

const productImagePromiseCache =
  new Map<
    string,
    Promise<HTMLImageElement>
  >();

// =========================================================
// FILE -> DATA URL
// =========================================================

function fileToDataUrl(
  file: File
): Promise<string> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const reader =
        new FileReader();

      reader.onload =
        () => {
          if (
            typeof reader.result ===
            "string"
          ) {
            resolve(
              reader.result
            );

            return;
          }

          reject(
            new Error(
              "Unable to read image."
            )
          );
        };

      reader.onerror =
        () => {
          reject(
            new Error(
              "Unable to read image."
            )
          );
        };

      reader.readAsDataURL(
        file
      );
    }
  );
}

// =========================================================
// HOOK
// =========================================================

export function useFabricDesigner(
  product: Product,
  currentView: ProductView,
  productColor: ProductColor,
  ref: ForwardedRef<
    FabricDesignerHandle
  >,
  onSelectionChange?: (
    isTextSelected:
      boolean
  ) => void,
  onTextStyleChange?: (
    style: TextStyle
  ) => void
) {
  // =========================================================
  // REFS
  // =========================================================

  const canvasElementRef =
    useRef<
      HTMLCanvasElement
    >(null);

  const canvasRef =
    useRef<
      Canvas | null
    >(null);

  const selectedTextRef =
    useRef<
      IText | null
    >(null);

  const previousViewRef =
    useRef<ProductView>(
      currentView
    );

  const onSelectionChangeRef =
    useRef(
      onSelectionChange
    );

  const onTextStyleChangeRef =
    useRef(
      onTextStyleChange
    );

  const switchRequestRef =
    useRef(
      0
    );

  const pendingUploadCountRef =
    useRef(
      0
    );

  const designsRef =
    useRef<DesignData>({
      front:
        [],

      back:
        [],

      left:
        [],

      right:
        [],
    });

  // =========================================================
  // PREMIUM FONTS
  // =========================================================

  const premiumFonts = [
    "Bebas Neue",
    "Pacifico",
    "Lobster",
    "Playfair Display",
    "Bangers",
    "Bungee",
    "Creepster",
    "Fugaz One",
    "Luckiest Guy",
    "Monoton",
    "Orbitron",
    "Righteous",
    "Russo One",
    "Staatliches",
    "Teko",
    "Silkscreen",
  ];

  // =========================================================
  // KEEP CALLBACKS CURRENT
  // =========================================================

  useEffect(() => {
    onSelectionChangeRef.current =
      onSelectionChange;
  }, [
    onSelectionChange,
  ]);

  useEffect(() => {
    onTextStyleChangeRef.current =
      onTextStyleChange;
  }, [
    onTextStyleChange,
  ]);

  // =========================================================
  // TEXT HELPERS
  // =========================================================

  function isTextObject(
    object:
      FabricObject | null
  ): object is IText {
    return (
      object instanceof
      IText
    );
  }

  function getTextStyle(
    textObject:
      IText
  ): TextStyle {
    return {
      fontFamily:
        textObject.fontFamily ??
        "Arial",

      fontWeight:
        textObject.fontWeight ===
        "bold"
          ? "bold"
          : "normal",

      fontStyle:
        textObject.fontStyle ===
        "italic"
          ? "italic"
          : "normal",

      underline:
        textObject.underline ??
        false,

      fill:
        typeof textObject.fill ===
        "string"
          ? textObject.fill
          : "#000000",

      fontSize:
        textObject.fontSize ??
        40,
    };
  }

  function selectText(
    textObject:
      IText
  ) {
    selectedTextRef.current =
      textObject;

    onSelectionChangeRef.current?.(
      true
    );

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );
  }

  function clearTextSelection() {
    selectedTextRef.current =
      null;

    onSelectionChangeRef.current?.(
      false
    );
  }

  // =========================================================
  // PREVIEW
  // =========================================================

  function getPreview():
    string | null {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return null;
    }

    canvas.discardActiveObject();

    canvas.requestRenderAll();

    return canvas.toDataURL({
      format:
        "png",

      quality:
        1,

      multiplier:
        1,
    });
  }

  // =========================================================
  // SIGNED URL CACHE
  // =========================================================

  async function getCachedAssetUrl(
    storagePath:
      string
  ): Promise<string> {
    const cachedUrl =
      designAssetUrlCache.get(
        storagePath
      );

    if (
      cachedUrl
    ) {
      return cachedUrl;
    }

    const signedUrl =
      await getDesignAssetUrl(
        storagePath
      );

    designAssetUrlCache.set(
      storagePath,
      signedUrl
    );

    return signedUrl;
  }

  // =========================================================
  // CUSTOMER IMAGE CACHE
  // =========================================================

  async function loadCachedImage(
    storagePath:
      string
  ): Promise<FabricImage> {
    const cachedElement =
      designImageCache.get(
        storagePath
      );

    if (
      cachedElement
    ) {
      return new FabricImage(
        cachedElement
      );
    }

    const existingPromise =
      designImagePromiseCache.get(
        storagePath
      );

    if (
      existingPromise
    ) {
      const element =
        await existingPromise;

      return new FabricImage(
        element
      );
    }

    const loadPromise =
      (
        async () => {
          const signedUrl =
            await getCachedAssetUrl(
              storagePath
            );

          const fabricImage =
            await FabricImage.fromURL(
              signedUrl,
              {
                crossOrigin:
                  "anonymous",
              }
            );

          const element =
            fabricImage.getElement();

          if (
            !(
              element instanceof
              HTMLImageElement
            )
          ) {
            throw new Error(
              `Unable to decode design image: ${storagePath}`
            );
          }

          designImageCache.set(
            storagePath,
            element
          );

          return element;
        }
      )();

    designImagePromiseCache.set(
      storagePath,
      loadPromise
    );

    try {
      const element =
        await loadPromise;

      return new FabricImage(
        element
      );
    } finally {
      designImagePromiseCache.delete(
        storagePath
      );
    }
  }

  // =========================================================
  // PRODUCT MOCKUP CACHE
  // =========================================================

  async function loadCachedProductImage(
    view:
      ProductView,

    color:
      ProductColor
  ): Promise<FabricImage> {
    const source =
      productAssets[
        product.type
      ]?.[
        color
      ]?.[
        view
      ];

    const display =
      productDisplay[
        product.type
      ]?.[
        view
      ];

    if (
      !source ||
      !display
    ) {
      throw new Error(
        `Missing designer configuration for ${product.type} / ${color} / ${view}`
      );
    }

    const cacheKey =
      `${product.type}:${color}:${view}`;

    const cachedElement =
      productImageCache.get(
        cacheKey
      );

    if (
      cachedElement
    ) {
      return new FabricImage(
        cachedElement
      );
    }

    const existingPromise =
      productImagePromiseCache.get(
        cacheKey
      );

    if (
      existingPromise
    ) {
      const element =
        await existingPromise;

      return new FabricImage(
        element
      );
    }

    const loadPromise =
      (
        async () => {
          const fabricImage =
            await FabricImage.fromURL(
              source
            );

          const element =
            fabricImage.getElement();

          if (
            !(
              element instanceof
              HTMLImageElement
            )
          ) {
            throw new Error(
              `Unable to load product image: ${cacheKey}`
            );
          }

          productImageCache.set(
            cacheKey,
            element
          );

          return element;
        }
      )();

    productImagePromiseCache.set(
      cacheKey,
      loadPromise
    );

    try {
      const element =
        await loadPromise;

      return new FabricImage(
        element
      );
    } finally {
      productImagePromiseCache.delete(
        cacheKey
      );
    }
  }

  // =========================================================
  // CREATE CANVAS
  // =========================================================

  useEffect(() => {
    if (
      !canvasElementRef.current
    ) {
      return;
    }

    const canvas =
      new Canvas(
        canvasElementRef.current,
        {
          width:
            700,

          height:
            700,

          backgroundColor:
            "#e5e7eb",

          preserveObjectStacking:
            true,
        }
      );

    canvasRef.current =
      canvas;

    previousViewRef.current =
      currentView;

    const updateSelection =
      () => {
        const activeObject =
          canvas.getActiveObject();

        if (
          activeObject &&
          isTextObject(
            activeObject
          )
        ) {
          selectText(
            activeObject
          );
        } else {
          clearTextSelection();
        }
      };

    const handleSelectionCleared =
      () => {
        clearTextSelection();
      };

    const handleMouseDown =
      (
        event:
          any
      ) => {
        const target =
          event.target as
            FabricObject | null;

        if (
          target &&
          isTextObject(
            target
          )
        ) {
          selectText(
            target
          );
        }
      };

    canvas.on(
      "selection:created",
      updateSelection
    );

    canvas.on(
      "selection:updated",
      updateSelection
    );

    canvas.on(
      "selection:cleared",
      handleSelectionCleared
    );

    canvas.on(
      "mouse:down",
      handleMouseDown
    );

    void loadProduct(
      currentView,
      productColor
    );

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

      canvasRef.current =
        null;
    };
  }, []);

  // =========================================================
  // VIEW CHANGE
  // =========================================================

  useEffect(() => {
    if (
      !canvasRef.current
    ) {
      return;
    }

    if (
      currentView ===
      previousViewRef.current
    ) {
      return;
    }

    void switchSide(
      currentView
    );
  }, [
    currentView,
  ]);

  // =========================================================
  // COLOR CHANGE
  // =========================================================

  useEffect(() => {
    if (
      !canvasRef.current
    ) {
      return;
    }

    void updateProductColor(
      currentView,
      productColor
    );
  }, [
    productColor,
  ]);

  // =========================================================
  // SAVE CURRENT SIDE
  // =========================================================

  function saveCurrentDesign(
    side:
      ProductView
  ) {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    const objects =
      canvas
        .getObjects()
        .filter(
          (
            object
          ) =>
            !(
              object as any
            ).data
              ?.isProduct
        );

    designsRef.current[
      side
    ] =
      objects.map(
        (
          object
        ) => {
          const serialized =
            object.toObject([
              "data",
            ]) as any;

          if (
            serialized.type ===
              "Image" &&
            serialized.data
              ?.storagePath
          ) {
            serialized.src =
              null;
          }

          return serialized;
        }
      );
  }

  // =========================================================
  // RESTORE SIDE
  // =========================================================

  async function restoreDesign(
    side:
      ProductView,

    requestId?:
      number
  ) {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    const requestIsStale =
      () =>
        requestId !==
          undefined &&
        requestId !==
          switchRequestRef.current;

    const objects =
      designsRef.current[
        side
      ];

    for (
      const objectData
      of objects
    ) {
      if (
        requestIsStale()
      ) {
        return;
      }

      if (
        (
          objectData as any
        ).data?.isProduct
      ) {
        continue;
      }

      // =====================================================
      // IMAGE
      // =====================================================

      if (
        objectData.type ===
        "Image"
      ) {
        const storagePath =
          (
            objectData as any
          ).data
            ?.storagePath as
            | string
            | undefined;

        let image:
          FabricImage | null =
          null;

        if (
          storagePath
        ) {
          try {
            image =
              await loadCachedImage(
                storagePath
              );
          } catch (
            error
          ) {
            console.error(
              "Unable to restore image:",
              storagePath,
              error
            );

            continue;
          }
        } else {
          const source =
            (
              objectData as any
            ).src;

          if (
            typeof source !==
            "string"
          ) {
            continue;
          }

          if (
            source.startsWith(
              "blob:"
            )
          ) {
            continue;
          }

          try {
            image =
              await FabricImage.fromURL(
                source,
                {
                  crossOrigin:
                    "anonymous",
                }
              );
          } catch (
            error
          ) {
            console.error(
              "Unable to restore local image:",
              error
            );

            continue;
          }
        }

        if (
          !image ||
          requestIsStale()
        ) {
          return;
        }

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

          selectable:
            true,

          evented:
            true,
        });

        (
          image as any
        ).data = {
          ...(
            objectData as any
          ).data,
        };

        canvas.add(
          image
        );

        continue;
      }

      // =====================================================
      // TEXT
      // =====================================================

      if (
        objectData.type ===
        "IText"
      ) {
        const fontFamily =
          (
            objectData as any
          ).fontFamily ??
          "Arial";

        const fontSize =
          (
            objectData as any
          ).fontSize ??
          40;

        try {
          await document.fonts.load(
            `${fontSize}px "${fontFamily}"`
          );
        } catch {
          // Browser fallback okay.
        }

        if (
          requestIsStale()
        ) {
          return;
        }

        const textObject =
          new IText(
            (
              objectData as any
            ).text ??
              "",
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

              fontSize,

              fill:
                typeof (
                  objectData as any
                ).fill ===
                "string"
                  ? (
                      objectData as any
                    ).fill
                  : "#000000",

              fontFamily,

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

              editable:
                true,

              selectable:
                true,

              evented:
                true,
            }
          );

        canvas.add(
          textObject
        );
      }
    }

    if (
      requestIsStale()
    ) {
      return;
    }

    canvas.requestRenderAll();
  }

  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  async function loadProduct(
    view:
      ProductView,

    color:
      ProductColor
  ) {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    const display =
      productDisplay[
        product.type
      ]?.[
        view
      ];

    if (
      !display
    ) {
      throw new Error(
        `Missing display configuration for ${product.type} / ${view}`
      );
    }

    canvas
      .getObjects()
      .forEach(
        (
          object
        ) => {
          if (
            (
              object as any
            ).data
              ?.isProduct
          ) {
            canvas.remove(
              object
            );
          }
        }
      );

    const image =
      await loadCachedProductImage(
        view,
        color
      );

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

    (
      image as any
    ).data = {
      isProduct:
        true,
    };

    canvas.add(
      image
    );

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
    view:
      ProductView
  ) {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    const requestId =
      ++switchRequestRef.current;

    const oldView =
      previousViewRef.current;

    saveCurrentDesign(
      oldView
    );

    selectedTextRef.current =
      null;

    canvas.discardActiveObject();

    clearTextSelection();

    canvas
      .getObjects()
      .forEach(
        (
          object
        ) => {
          if (
            !(
              object as any
            ).data
              ?.isProduct
          ) {
            canvas.remove(
              object
            );
          }
        }
      );

    await loadProduct(
      view,
      productColor
    );

    if (
      requestId !==
      switchRequestRef.current
    ) {
      return;
    }

    await restoreDesign(
      view,
      requestId
    );

    if (
      requestId !==
      switchRequestRef.current
    ) {
      return;
    }

    previousViewRef.current =
      view;

    canvas.requestRenderAll();
  }

  // =========================================================
  // COLOR
  // =========================================================

  async function updateProductColor(
    view:
      ProductView,

    color:
      ProductColor
  ) {
    await loadProduct(
      view,
      color
    );
  }

  // =========================================================
  // WAIT FOR UPLOADS
  // =========================================================

  async function waitForPendingUploads() {
    while (
      pendingUploadCountRef.current >
      0
    ) {
      await new Promise<void>(
        (
          resolve
        ) => {
          window.setTimeout(
            resolve,
            50
          );
        }
      );
    }
  }

  // =========================================================
  // ADD IMAGE
  // =========================================================

  async function addImage(
    file:
      File,

    userId?:
      string
  ) {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    const localUrl =
      await fileToDataUrl(
        file
      );

    const image =
      await FabricImage.fromURL(
        localUrl
      );

    image.scaleToWidth(
      120
    );

    image.set({
      left:
        350,

      top:
        320,

      originX:
        "center",

      originY:
        "center",

      selectable:
        true,

      evented:
        true,
    });

    const uploadId =
      crypto.randomUUID();

    // =====================================================
    // GUEST
    // =====================================================

    if (
      !userId
    ) {
      (
        image as any
      ).data = {
        guestImage:
          true,

        pendingUpload:
          false,

        uploadId,

        originalFileName:
          file.name,
      };

      canvas.add(
        image
      );

      canvas.setActiveObject(
        image
      );

      canvas.requestRenderAll();

      saveCurrentDesign(
        previousViewRef.current
      );

      return;
    }

    // =====================================================
    // SIGNED-IN USER
    // =====================================================

    (
      image as any
    ).data = {
      pendingUpload:
        true,

      uploadId,

      originalFileName:
        file.name,
    };

    canvas.add(
      image
    );

    canvas.setActiveObject(
      image
    );

    canvas.requestRenderAll();

    pendingUploadCountRef.current +=
      1;

    try {
      const storagePath =
        await uploadDesignAsset(
          file,
          userId
        );

      (
        image as any
      ).data = {
        ...(
          image as any
        ).data,

        pendingUpload:
          false,

        storagePath,

        originalFileName:
          file.name,
      };

      (
        Object.keys(
          designsRef.current
        ) as ProductView[]
      ).forEach(
        (
          side
        ) => {
          designsRef.current[
            side
          ].forEach(
            (
              savedObject
            ) => {
              if (
                (
                  savedObject as any
                ).data
                  ?.uploadId !==
                uploadId
              ) {
                return;
              }

              (
                savedObject as any
              ).data = {
                ...(
                  savedObject as any
                ).data,

                pendingUpload:
                  false,

                storagePath,

                originalFileName:
                  file.name,
              };

              (
                savedObject as any
              ).src =
                null;
            }
          );
        }
      );

      const element =
        image.getElement();

      if (
        element instanceof
        HTMLImageElement
      ) {
        designImageCache.set(
          storagePath,
          element
        );
      }

      saveCurrentDesign(
        previousViewRef.current
      );
    } catch (
      error
    ) {
      console.error(
        "Image upload failed:",
        error
      );

      (
        image as any
      ).data = {
        ...(
          image as any
        ).data,

        pendingUpload:
          false,

        uploadFailed:
          true,
      };

      saveCurrentDesign(
        previousViewRef.current
      );

      throw error;
    } finally {
      pendingUploadCountRef.current =
        Math.max(
          0,
          pendingUploadCountRef.current -
            1
        );
    }
  }

  // =========================================================
  // ADD TEXT
  // =========================================================

  async function addText(
    text:
      string
  ) {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    await document.fonts.ready;

    const textObject =
      new IText(
        text,
        {
          left:
            350,

          top:
            320,

          originX:
            "center",

          originY:
            "center",

          fontSize:
            40,

          fill:
            "#000000",

          fontFamily:
            "Poppins",

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
        }
      );

    canvas.add(
      textObject
    );

    canvas.setActiveObject(
      textObject
    );

    selectText(
      textObject
    );

    canvas.requestRenderAll();
  }

  // =========================================================
  // SELECTED TEXT
  // =========================================================

  function getSelectedText():
    IText | null {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return null;
    }

    const activeObject =
      canvas.getActiveObject();

    if (
      activeObject &&
      isTextObject(
        activeObject
      )
    ) {
      selectedTextRef.current =
        activeObject;

      return activeObject;
    }

    return selectedTextRef.current;
  }

  function getSelectedTextStyle():
    TextStyle | null {
    const textObject =
      getSelectedText();

    if (
      !textObject
    ) {
      return null;
    }

    return getTextStyle(
      textObject
    );
  }

  function refreshCanvas() {
    canvasRef.current
      ?.requestRenderAll();
  }

  // =========================================================
  // TEXT COLOR
  // =========================================================

  function updateSelectedTextColor(
    color:
      string
  ) {
    const textObject =
      getSelectedText();

    if (
      !textObject
    ) {
      return;
    }

    textObject.set({
      fill:
        color,
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

  async function updateSelectedFont(
    fontFamily:
      string
  ) {
    const textObject =
      getSelectedText();

    if (
      !textObject
    ) {
      return;
    }

    try {
      await document.fonts.load(
        `${
          textObject.fontSize ??
          40
        }px "${fontFamily}"`
      );

      textObject.set({
        fontFamily,
      });

      textObject.initDimensions();

      textObject.setCoords();

      onTextStyleChangeRef.current?.(
        getTextStyle(
          textObject
        )
      );

      refreshCanvas();
    } catch (
      error
    ) {
      console.error(
        "Font loading failed:",
        error
      );
    }
  }

  function toggleBold() {
    const textObject =
      getSelectedText();

    if (
      !textObject
    ) {
      return;
    }

    textObject.set({
      fontWeight:
        textObject.fontWeight ===
        "bold"
          ? "normal"
          : "bold",
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  function toggleItalic() {
    const textObject =
      getSelectedText();

    if (
      !textObject
    ) {
      return;
    }

    textObject.set({
      fontStyle:
        textObject.fontStyle ===
        "italic"
          ? "normal"
          : "italic",
    });

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  function toggleUnderline() {
    const textObject =
      getSelectedText();

    if (
      !textObject
    ) {
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

  function changeFontSize(
    amount:
      number
  ) {
    const textObject =
      getSelectedText();

    if (
      !textObject
    ) {
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

    textObject.initDimensions();

    textObject.setCoords();

    onTextStyleChangeRef.current?.(
      getTextStyle(
        textObject
      )
    );

    refreshCanvas();
  }

  // =========================================================
  // DELETE
  // =========================================================

  function deleteSelected() {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    const activeObject =
      canvas.getActiveObject();

    if (
      !activeObject
    ) {
      return;
    }

    if (
      (
        activeObject as any
      ).data
        ?.isProduct
    ) {
      return;
    }

    canvas.remove(
      activeObject
    );

    canvas.discardActiveObject();

    clearTextSelection();

    canvas.requestRenderAll();
  }

  // =========================================================
  // KEYBOARD DELETE
  // =========================================================

  useEffect(() => {
    function handleKeyDown(
      event:
        KeyboardEvent
    ) {
      const target =
        event.target as
          HTMLElement | null;

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
        event.key !==
          "Delete" &&
        event.key !==
          "Backspace"
      ) {
        return;
      }

      const canvas =
        canvasRef.current;

      if (
        !canvas
      ) {
        return;
      }

      const activeObject =
        canvas.getActiveObject();

      if (
        !activeObject
      ) {
        return;
      }

      if (
        (
          activeObject as any
        ).data
          ?.isProduct
      ) {
        return;
      }

      event.preventDefault();

      canvas.remove(
        activeObject
      );

      canvas.discardActiveObject();

      clearTextSelection();

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
  // EXPORT DESIGN DATA
  // =========================================================

  function getDesignData():
    DesignData {
    saveCurrentDesign(
      previousViewRef.current
    );

    return {
      front: [
        ...designsRef.current
          .front,
      ],

      back: [
        ...designsRef.current
          .back,
      ],

      left: [
        ...designsRef.current
          .left,
      ],

      right: [
        ...designsRef.current
          .right,
      ],
    };
  }

  // =========================================================
  // PRELOAD SAVED ASSETS
  // =========================================================

  async function preloadDesignAssets(
    designData:
      DesignData
  ) {
    const storagePaths =
      new Set<string>();

    (
      Object.keys(
        designData
      ) as ProductView[]
    ).forEach(
      (
        side
      ) => {
        designData[
          side
        ].forEach(
          (
            object
          ) => {
            if (
              object.type !==
              "Image"
            ) {
              return;
            }

            const storagePath =
              (
                object as any
              ).data
                ?.storagePath;

            if (
              typeof storagePath ===
              "string"
            ) {
              storagePaths.add(
                storagePath
              );
            }
          }
        );
      }
    );

    await Promise.all(
      Array.from(
        storagePaths
      ).map(
        async (
          storagePath
        ) => {
          if (
            designImageCache.has(
              storagePath
            )
          ) {
            return;
          }

          try {
            await loadCachedImage(
              storagePath
            );
          } catch (
            error
          ) {
            console.error(
              "Unable to preload asset:",
              storagePath,
              error
            );
          }
        }
      )
    );
  }

  // =========================================================
  // LOAD SAVED DESIGN
  // =========================================================

  async function loadDesignData(
    designData:
      DesignData,

    initialView:
      ProductView =
        "front"
  ) {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return;
    }

    const requestId =
      ++switchRequestRef.current;

    designsRef.current = {
      front: [
        ...(
          designData.front ??
          []
        ),
      ],

      back: [
        ...(
          designData.back ??
          []
        ),
      ],

      left: [
        ...(
          designData.left ??
          []
        ),
      ],

      right: [
        ...(
          designData.right ??
          []
        ),
      ],
    };

    selectedTextRef.current =
      null;

    canvas.discardActiveObject();

    clearTextSelection();

    canvas
      .getObjects()
      .forEach(
        (
          object
        ) => {
          if (
            !(
              object as any
            ).data
              ?.isProduct
          ) {
            canvas.remove(
              object
            );
          }
        }
      );

    previousViewRef.current =
      initialView;

    await loadProduct(
      initialView,
      productColor
    );

    if (
      requestId !==
      switchRequestRef.current
    ) {
      return;
    }

    await restoreDesign(
      initialView,
      requestId
    );

    if (
      requestId !==
      switchRequestRef.current
    ) {
      return;
    }

    canvas.requestRenderAll();

    void preloadDesignAssets(
      designsRef.current
    );

    const views =
      product.supportedViews;

    void Promise.all(
      views.map(
        async (
          view
        ) => {
          if (
            view ===
            initialView
          ) {
            return;
          }

          try {
            await loadCachedProductImage(
              view,
              productColor
            );
          } catch (
            error
          ) {
            console.error(
              `Unable to preload ${view} product image:`,
              error
            );
          }
        }
      )
    );
  }

  // =========================================================
  // PREVIEWS
  // =========================================================

  async function getAllPreviews(): Promise<
    Partial<
      Record<
        ProductView,
        string
      >
    >
  > {
    const canvas =
      canvasRef.current;

    if (
      !canvas
    ) {
      return {};
    }

    saveCurrentDesign(
      previousViewRef.current
    );

    const originalView =
      previousViewRef.current;

    const previews:
      Partial<
        Record<
          ProductView,
          string
        >
      > = {};

    const views =
      product.supportedViews;

    for (
      const view
      of views
    ) {
      const objects =
        designsRef.current[
          view
        ];

      const hasCustomerContent =
        objects.some(
          (
            object
          ) => {
            if (
              object.type ===
              "IText"
            ) {
              return true;
            }

            if (
              object.type ===
              "Image"
            ) {
              const storagePath =
                (
                  object as any
                ).data
                  ?.storagePath;

              const source =
                (
                  object as any
                ).src;

              return Boolean(
                storagePath ||
                  (
                    typeof source ===
                      "string" &&
                    !source.startsWith(
                      "blob:"
                    )
                  )
              );
            }

            return false;
          }
        );

      if (
        !hasCustomerContent
      ) {
        continue;
      }

      if (
        previousViewRef.current !==
        view
      ) {
        await switchSide(
          view
        );
      }

      canvas.discardActiveObject();

      canvas.requestRenderAll();

      previews[
        view
      ] =
        canvas.toDataURL({
          format:
            "png",

          quality:
            1,

          multiplier:
            1,
        });
    }

    if (
      previousViewRef.current !==
      originalView
    ) {
      await switchSide(
        originalView
      );
    }

    return previews;
  }

  // =========================================================
  // SUMMARY
  // =========================================================

  function getCustomizationSummary() {
    let textCount =
      0;

    let imageCount =
      0;

    let premiumFontUsed =
      false;

    saveCurrentDesign(
      previousViewRef.current
    );

    (
      Object.keys(
        designsRef.current
      ) as ProductView[]
    ).forEach(
      (
        side
      ) => {
        designsRef.current[
          side
        ].forEach(
          (
            object
          ) => {
            if (
              object.type ===
              "IText"
            ) {
              textCount +=
                1;

              const fontFamily =
                (
                  object as any
                ).fontFamily;

              if (
                premiumFonts.includes(
                  fontFamily
                )
              ) {
                premiumFontUsed =
                  true;
              }
            }

            if (
              object.type ===
              "Image"
            ) {
              const storagePath =
                (
                  object as any
                ).data
                  ?.storagePath;

              const source =
                (
                  object as any
                ).src;

              if (
                storagePath ||
                (
                  typeof source ===
                    "string" &&
                  !source.startsWith(
                    "blob:"
                  )
                )
              ) {
                imageCount +=
                  1;
              }
            }
          }
        );
      }
    );

    return {
      textCount,
      imageCount,
      premiumFontUsed,
    };
  }

  // =========================================================
  // EXPOSE
  // =========================================================

  useImperativeHandle(
    ref,
    () => ({
      addImage,

      addText,

      deleteSelected,

      getPreview,

      getAllPreviews,

      getDesignData,

      getCustomizationSummary,

      updateSelectedTextColor,

      updateSelectedFont,

      toggleBold,

      toggleItalic,

      toggleUnderline,

      changeFontSize,

      getSelectedTextStyle,

      loadDesignData,

      waitForPendingUploads,
    })
  );

  return canvasElementRef;
}