import { supabase } from "../lib/supabase";

const DESIGN_ASSET_BUCKET =
  "design-assets";

const MAX_UPLOAD_SIZE =
  10 * 1024 * 1024; // 10 MB

function sanitizeFileName(
  fileName: string
) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(
      /[^a-z0-9._-]/g,
      ""
    );
}

export async function uploadDesignAsset(
  file: File,
  userId: string
) {
  if (
    file.size >
    MAX_UPLOAD_SIZE
  ) {
    throw new Error(
      "Image must be 10 MB or smaller."
    );
  }

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      "Only PNG, JPEG and WebP images are supported."
    );
  }

  const assetId =
    crypto.randomUUID();

  const safeFileName =
    sanitizeFileName(
      file.name
    );

  const storagePath =
    `${userId}/uploads/${assetId}-${safeFileName}`;

  const {
    error,
  } =
    await supabase.storage
      .from(
        DESIGN_ASSET_BUCKET
      )
      .upload(
        storagePath,
        file,
        {
          contentType:
            file.type,

          cacheControl:
            "3600",

          upsert:
            false,
        }
      );

  if (error) {
    throw error;
  }

  return storagePath;
}

export async function getDesignAssetUrl(
  storagePath: string
) {
  const {
    data,
    error,
  } =
    await supabase.storage
      .from(
        DESIGN_ASSET_BUCKET
      )
      .createSignedUrl(
        storagePath,
        60 * 60
      );

  if (error) {
    throw error;
  }

  return data.signedUrl;
}