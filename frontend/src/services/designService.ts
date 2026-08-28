import { supabase } from "../lib/supabase";

import type { ProductView } from "../types/designer";
import type { ProductColor } from "../types/productColor";

interface SaveDesignParams {
  id: string;

  userId: string;

  productId: number;
  productName: string;

  color: ProductColor;
  size: string;
  quantity: number;

  currentView: ProductView;

  designData: {
    front: unknown[];
    back: unknown[];
    left: unknown[];
    right: unknown[];
  };

  previews: Partial<
    Record<ProductView, string>
  >;

  customizationPrice: number;
}

function dataUrlToBlob(
  dataUrl: string
): Blob {
  const [metadata, base64Data] =
    dataUrl.split(",");

  if (!metadata || !base64Data) {
    throw new Error(
      "Invalid preview image."
    );
  }

  const mimeMatch =
    metadata.match(
      /data:(.*?);base64/
    );

  const mimeType =
    mimeMatch?.[1] ??
    "image/png";

  const binary =
    atob(base64Data);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(index);
  }

  return new Blob(
    [bytes],
    {
      type: mimeType,
    }
  );
}

export async function saveDesign({
  id,

  userId,

  productId,
  productName,

  color,
  size,
  quantity,

  currentView,

  designData,

  previews,

  customizationPrice,
}: SaveDesignParams) {
  // =========================================
  // UPLOAD ALL PREVIEWS
  // =========================================

  const previewPaths: Partial<
    Record<ProductView, string>
  > = {};

  const uploadedPaths: string[] =
    [];

  try {
    for (
      const [view, dataUrl]
      of Object.entries(previews)
    ) {
      if (!dataUrl) {
        continue;
      }

      const previewBlob =
        dataUrlToBlob(
          dataUrl
        );

      const previewPath =
        `${userId}/${id}/${view}.png`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            "design-previews"
          )
          .upload(
            previewPath,
            previewBlob,
            {
              contentType:
                "image/png",

              upsert:
                false,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      previewPaths[
        view as ProductView
      ] = previewPath;

      uploadedPaths.push(
        previewPath
      );
    }

    // =========================================
    // PRIMARY PREVIEW
    // =========================================

    const primaryPreviewPath =
      previewPaths.front ??
      previewPaths[
        currentView
      ] ??
      Object.values(
        previewPaths
      )[0] ??
      null;

    // =========================================
    // DATABASE
    // =========================================

    const {
      data,
      error: insertError,
    } =
      await supabase
        .from("saved_designs")
        .insert({
          id,

          user_id:
            userId,

          product_id:
            productId,

          product_name:
            productName,

          color,

          size,

          quantity,

          current_view:
            currentView,

          front_design:
            designData.front,

          back_design:
            designData.back,

          left_design:
            designData.left,

          right_design:
            designData.right,

          /*
           * Main cart / saved-design thumbnail.
           */
          preview_url:
            primaryPreviewPath,

          /*
           * All customized-side preview paths.
           *
           * Example:
           * {
           *   front: ".../front.png",
           *   left: ".../left.png"
           * }
           */
          preview_paths:
            previewPaths,

          customization_price:
            customizationPrice,
        })
        .select("id")
        .single();

    if (insertError) {
      throw insertError;
    }

    return {
      id:
        data.id,

      previewPath:
        primaryPreviewPath,

      previewPaths,
    };
  } catch (error) {
    // =========================================
    // CLEAN UP PARTIAL UPLOADS
    // =========================================

    if (
      uploadedPaths.length >
      0
    ) {
      await supabase.storage
        .from(
          "design-previews"
        )
        .remove(
          uploadedPaths
        );
    }

    throw error;
  }
}

export interface SavedDesignRecord {
  id: string;

  user_id: string;

  product_id: number;
  product_name: string;

  color: ProductColor;
  size: string;
  quantity: number;

  current_view: ProductView;

  front_design: unknown[];
  back_design: unknown[];
  left_design: unknown[];
  right_design: unknown[];

  preview_url: string | null;

  preview_paths:
    Partial<
      Record<
        ProductView,
        string
      >
    >;

  customization_price: number;
}

export async function getSavedDesign(
  designId: string
) {
  const {
    data,
    error,
  } =
    await supabase
      .from("saved_designs")
      .select("*")
      .eq(
        "id",
        designId
      )
      .single();

  if (error) {
    throw error;
  }

  return data as SavedDesignRecord;
}

interface UpdateDesignParams
  extends SaveDesignParams {}

export async function updateDesign({
  id,

  userId,

  productId,
  productName,

  color,
  size,
  quantity,

  currentView,

  designData,

  previews,

  customizationPrice,
}: UpdateDesignParams) {
  const previewPaths: Partial<
    Record<
      ProductView,
      string
    >
  > = {};

  for (
    const [
      view,
      dataUrl,
    ] of Object.entries(
      previews
    )
  ) {
    if (!dataUrl) {
      continue;
    }

    const previewBlob =
      dataUrlToBlob(
        dataUrl
      );

    const previewPath =
      `${userId}/${id}/${view}.png`;

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "design-previews"
        )
        .upload(
          previewPath,
          previewBlob,
          {
            contentType:
              "image/png",

            /*
             * Existing design:
             * overwrite old preview.
             */
            upsert:
              true,
          }
        );

    if (
      uploadError
    ) {
      throw uploadError;
    }

    previewPaths[
      view as ProductView
    ] = previewPath;
  }

  const primaryPreviewPath =
    previewPaths.front ??
    previewPaths[
      currentView
    ] ??
    Object.values(
      previewPaths
    )[0] ??
    null;

  const {
    error,
  } =
    await supabase
      .from(
        "saved_designs"
      )
      .update({
        product_id:
          productId,

        product_name:
          productName,

        color,

        size,

        quantity,

        current_view:
          currentView,

        front_design:
          designData.front,

        back_design:
          designData.back,

        left_design:
          designData.left,

        right_design:
          designData.right,

        preview_url:
          primaryPreviewPath,

        preview_paths:
          previewPaths,

        customization_price:
          customizationPrice,
      })
      .eq(
        "id",
        id
      );

  if (error) {
    throw error;
  }

  return {
    id,
    previewPath:
      primaryPreviewPath,

    previewPaths,
  };
}