import {
  supabase,
} from "../lib/supabase";

import type {
  CartItem,
} from "../types/cart";

import type {
  ProductView,
} from "../types/designer";

import type {
  CreateOrderParams,
  CreatedOrder,
} from "../types/order";

import {
  getGuestDesign,
} from "./guestDesignService";

// =========================================================
// TYPES
// =========================================================

type DesignData = {
  front: any[];

  back: any[];

  left: any[];

  right: any[];
};

// =========================================================
// DATA URL → BLOB
// =========================================================

function dataUrlToBlob(
  dataUrl: string
): Blob {
  const [
    metadata,
    encoded,
  ] =
    dataUrl.split(",");

  if (
    !metadata ||
    !encoded
  ) {
    throw new Error(
      "Invalid image data."
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
    atob(
      encoded
    );

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let index = 0;
    index <
    binary.length;
    index += 1
  ) {
    bytes[
      index
    ] =
      binary.charCodeAt(
        index
      );
  }

  return new Blob(
    [
      bytes,
    ],
    {
      type:
        mimeType,
    }
  );
}

// =========================================================
// FILE EXTENSION
// =========================================================

function getExtensionFromDataUrl(
  dataUrl: string
) {
  if (
    dataUrl.startsWith(
      "data:image/jpeg"
    )
  ) {
    return "jpg";
  }

  if (
    dataUrl.startsWith(
      "data:image/webp"
    )
  ) {
    return "webp";
  }

  if (
    dataUrl.startsWith(
      "data:image/gif"
    )
  ) {
    return "gif";
  }

  return "png";
}

// =========================================================
// UPLOAD DATA URL
// =========================================================

async function uploadDataUrl(
  path: string,
  dataUrl: string
) {
  const blob =
    dataUrlToBlob(
      dataUrl
    );

  const {
    error,
  } =
    await supabase.storage
      .from(
        "order-assets"
      )
      .upload(
        path,
        blob,
        {
          contentType:
            blob.type,

          /*
           * Every submitted order gets a unique path.
           * We do not want permanent order artwork
           * overwritten.
           */
          upsert:
            false,
        }
      );

  if (
    error
  ) {
    throw error;
  }

  return path;
}

// =========================================================
// ORDER NUMBER
// =========================================================

function createOrderNumber() {
  const now =
    new Date();

  const year =
    now
      .getFullYear()
      .toString();

  const month =
    String(
      now.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  const random =
    crypto
      .randomUUID()
      .replaceAll(
        "-",
        ""
      )
      .slice(
        0,
        6
      )
      .toUpperCase();

  return `KT-${year}${month}${day}-${random}`;
}

// =========================================================
// COPY DESIGN OBJECT
// =========================================================

function cloneDesignData(
  designData:
    DesignData
): DesignData {
  return structuredClone(
    designData
  );
}

// =========================================================
// PERMANENTLY STORE GUEST ARTWORK
//
// Guest Fabric images currently contain:
//
// src: "data:image/..."
// data: {
//   guestImage: true,
//   uploadId: "..."
// }
//
// At checkout we upload these images and turn them into:
//
// src: null
// data: {
//   orderAssetPath: "..."
// }
//
// The submitted order therefore no longer depends on
// IndexedDB.
// =========================================================

async function persistGuestDesignAssets(
  orderId: string,

  itemId: string,

  designData:
    DesignData
): Promise<DesignData> {
  const permanentDesign =
    cloneDesignData(
      designData
    );

  /*
   * The same uploaded image can be referenced more than
   * once while switching between product views.
   *
   * Cache by uploadId so it is uploaded only once.
   */
  const uploadedArtwork =
    new Map<
      string,
      string
    >();

  const views:
    ProductView[] = [
      "front",
      "back",
      "left",
      "right",
    ];

  for (
    const view
    of views
  ) {
    const objects =
      permanentDesign[
        view
      ];

    for (
      const object
      of objects
    ) {
      if (
        object.type !==
        "Image"
      ) {
        continue;
      }

      /*
       * This image may already reference a permanent
       * authenticated design asset.
       */
      if (
        object.data
          ?.storagePath
      ) {
        continue;
      }

      const source =
        object.src;

      if (
        typeof source !==
          "string" ||
        !source.startsWith(
          "data:image/"
        )
      ) {
        continue;
      }

      const uploadId =
        object.data
          ?.uploadId ??
        crypto.randomUUID();

      let permanentPath =
        uploadedArtwork.get(
          uploadId
        );

      if (
        !permanentPath
      ) {
        const extension =
          getExtensionFromDataUrl(
            source
          );

        permanentPath =
          `${orderId}/${itemId}/artwork/${uploadId}.${extension}`;

        await uploadDataUrl(
          permanentPath,
          source
        );

        uploadedArtwork.set(
          uploadId,
          permanentPath
        );
      }

      object.data = {
        ...(
          object.data ??
          {}
        ),

        guestImage:
          false,

        pendingUpload:
          false,

        orderAssetPath:
          permanentPath,
      };

      /*
       * Remove the huge base64 value before saving
       * the JSON to PostgreSQL.
       */
      object.src =
        null;
    }
  }

  return permanentDesign;
}

// =========================================================
// UPLOAD ALL CUSTOMIZED-SIDE PREVIEWS
//
// Example:
//
// front.png
// back.png
//
// Left/right are only created if those views actually have
// customized previews.
// =========================================================

async function persistOrderPreviews(
  orderId: string,

  item: CartItem
): Promise<
  Partial<
    Record<
      ProductView,
      string
    >
  >
> {
  const previewPaths: Partial<
    Record<
      ProductView,
      string
    >
  > = {};

  const previews =
    item.designPreviews;

  if (
    !previews
  ) {
    return previewPaths;
  }

  const views:
    ProductView[] = [
      "front",
      "back",
      "left",
      "right",
    ];

  for (
    const view
    of views
  ) {
    const dataUrl =
      previews[
        view
      ];

    if (
      !dataUrl ||
      !dataUrl.startsWith(
        "data:image/"
      )
    ) {
      continue;
    }

    const path =
      `${orderId}/${item.id}/${view}.png`;

    await uploadDataUrl(
      path,
      dataUrl
    );

    previewPaths[
      view
    ] =
      path;
  }

  return previewPaths;
}

// =========================================================
// FALLBACK MAIN PREVIEW
//
// Useful for older cart items that were created before
// designPreviews was added.
// =========================================================

async function persistFallbackPreview(
  orderId: string,

  item: CartItem
): Promise<
  string | null
> {
  const preview =
    item.designPreview;

  if (
    !preview ||
    !preview.startsWith(
      "data:image/"
    )
  ) {
    return null;
  }

  const path =
    `${orderId}/${item.id}/preview.png`;

  await uploadDataUrl(
    path,
    preview
  );

  return path;
}

// =========================================================
// PREPARE ONE ORDER ITEM
// =========================================================

async function prepareOrderItem(
  orderId: string,

  item: CartItem
) {
  let designData:
    DesignData | null =
    null;

  let permanentDesignId:
    string | null =
    null;

  // =======================================================
  // GUEST CUSTOM DESIGN
  // =======================================================

  if (
    item.customized &&
    item.id.startsWith(
      "guest-"
    )
  ) {
    const guestDesign =
      await getGuestDesign(
        item.id
      );

    if (
      !guestDesign
    ) {
      throw new Error(
        `The saved design for ${item.productName} could not be found. Please return to the cart and edit the design again.`
      );
    }

    designData =
      await persistGuestDesignAssets(
        orderId,
        item.id,
        guestDesign.designData
      );
  }

  // =======================================================
  // SIGNED-IN DESIGN
  //
  // The existing saved_designs row remains linked by ID.
  // =======================================================

  if (
    item.customized &&
    !item.id.startsWith(
      "guest-"
    )
  ) {
    permanentDesignId =
      item.id;
  }

  // =======================================================
  // ALL CUSTOMIZED-SIDE PREVIEWS
  // =======================================================

  const previewPaths =
    await persistOrderPreviews(
      orderId,
      item
    );

  // =======================================================
  // PRIMARY PREVIEW
  //
  // Prefer:
  // front
  // then first available customized side
  // then legacy cart preview
  // =======================================================

  let previewPath:
  string | null =
  previewPaths.front ??
  Object.values(
    previewPaths
  )[0] ??
  null;

  /*
   * Existing cart entries created before this update will
   * not contain designPreviews. Keep them working by
   * uploading the old single preview.
   */
  if (
    !previewPath
  ) {
    previewPath =
      await persistFallbackPreview(
        orderId,
        item
      );
  }

  return {
    id:
      crypto.randomUUID(),

    order_id:
      orderId,

    design_id:
      permanentDesignId,

    product_id:
      item.productId,

    product_name:
      item.productName,

    color:
      item.color,

    size:
      item.size,

    quantity:
      item.quantity,

    base_price:
      item.basePrice,

    customization_price:
      item.customizationPrice,

    unit_price:
      item.unitPrice,

    line_total:
      item.unitPrice *
      item.quantity,

    customized:
      item.customized,

    customization:
      item.customization,

    design_data:
      designData,

    /*
     * Main thumbnail for admin/order display.
     */
    preview_path:
      previewPath,

    /*
     * Exact side → image mapping.
     *
     * Example:
     * {
     *   front: ".../front.png",
     *   back: ".../back.png"
     * }
     */
    preview_paths:
      previewPaths,
  };
}

// =========================================================
// CREATE ORDER
// =========================================================

export async function createOrder({
  userId,

  customer,

  items,

  subtotal,

  deliveryFee,
}: CreateOrderParams): Promise<CreatedOrder> {
  if (
    items.length ===
    0
  ) {
    throw new Error(
      "Your cart is empty."
    );
  }

  const orderId =
    crypto.randomUUID();

  const orderNumber =
    createOrderNumber();

  const total =
    subtotal +
    deliveryFee;

  // =======================================================
  // PERMANENTLY PREPARE ITEM ASSETS FIRST
  // =======================================================

  const preparedItems =
    [];

  for (
    const item
    of items
  ) {
    const prepared =
      await prepareOrderItem(
        orderId,
        item
      );

    preparedItems.push(
      prepared
    );
  }

  // =======================================================
  // CREATE ORDER
  // =======================================================

  const {
    error:
      orderError,
  } =
    await supabase
      .from(
        "orders"
      )
      .insert({
        id:
          orderId,

        order_number:
          orderNumber,

        user_id:
          userId ??
          null,

        customer_name:
          customer.name.trim(),

        customer_email:
          customer.email
            .trim()
            .toLowerCase(),

        customer_phone:
          customer.phone.trim(),

        address_line_1:
          customer.addressLine1.trim(),

        address_line_2:
          customer.addressLine2
            .trim() ||
          null,

        city:
          customer.city.trim(),

        postal_code:
          customer.postalCode
            .trim() ||
          null,

        notes:
          customer.notes
            .trim() ||
          null,

        subtotal,

        delivery_fee:
          deliveryFee,

        total,

        status:
          "pending",
      });

  if (
    orderError
  ) {
    throw orderError;
  }

  // =======================================================
  // CREATE ORDER ITEMS
  // =======================================================

  const {
    error:
      itemError,
  } =
    await supabase
      .from(
        "order_items"
      )
      .insert(
        preparedItems
      );

  if (
    itemError
  ) {
    throw itemError;
  }

  return {
    id:
      orderId,

    orderNumber,

    subtotal,

    deliveryFee,

    total,
  };
}