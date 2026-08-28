import type { ProductColor } from "../types/productColor";
import type { ProductView } from "../types/designer";

// =========================================================
// TYPES
// =========================================================

export interface GuestDesignRecord {
  id: string;

  productId: number;

  productName: string;

  color: ProductColor;

  size: string;

  quantity: number;

  currentView: ProductView;

  designData: {
    front: any[];
    back: any[];
    left: any[];
    right: any[];
  };

  customizationPrice: number;

  updatedAt: string;
}

// =========================================================
// INDEXEDDB CONFIG
// =========================================================

const DATABASE_NAME =
  "kingdom-threads";

const DATABASE_VERSION =
  1;

const GUEST_DESIGN_STORE =
  "guest-designs";

// =========================================================
// OPEN DATABASE
// =========================================================

function openDatabase(): Promise<IDBDatabase> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const request =
        indexedDB.open(
          DATABASE_NAME,
          DATABASE_VERSION
        );

      request.onupgradeneeded =
        () => {
          const database =
            request.result;

          if (
            !database.objectStoreNames.contains(
              GUEST_DESIGN_STORE
            )
          ) {
            database.createObjectStore(
              GUEST_DESIGN_STORE,
              {
                keyPath: "id",
              }
            );
          }
        };

      request.onsuccess =
        () => {
          resolve(
            request.result
          );
        };

      request.onerror =
        () => {
          reject(
            request.error ??
              new Error(
                "Unable to open guest design storage."
              )
          );
        };

      request.onblocked =
        () => {
          reject(
            new Error(
              "Guest design storage is currently blocked."
            )
          );
        };
    }
  );
}

// =========================================================
// SAVE GUEST DESIGN
// =========================================================

export async function saveGuestDesign(
  design: GuestDesignRecord
): Promise<void> {
  const database =
    await openDatabase();

  try {
    await new Promise<void>(
      (
        resolve,
        reject
      ) => {
        const transaction =
          database.transaction(
            GUEST_DESIGN_STORE,
            "readwrite"
          );

        const store =
          transaction.objectStore(
            GUEST_DESIGN_STORE
          );

        store.put(
          design
        );

        transaction.oncomplete =
          () => {
            resolve();
          };

        transaction.onerror =
          () => {
            reject(
              transaction.error ??
                new Error(
                  "Unable to save guest design."
                )
            );
          };

        transaction.onabort =
          () => {
            reject(
              transaction.error ??
                new Error(
                  "Guest design save was cancelled."
                )
            );
          };
      }
    );
  } finally {
    database.close();
  }
}

// =========================================================
// GET GUEST DESIGN
// =========================================================

export async function getGuestDesign(
  designId: string
): Promise<GuestDesignRecord | null> {
  const database =
    await openDatabase();

  try {
    return await new Promise<
      GuestDesignRecord | null
    >(
      (
        resolve,
        reject
      ) => {
        const transaction =
          database.transaction(
            GUEST_DESIGN_STORE,
            "readonly"
          );

        const store =
          transaction.objectStore(
            GUEST_DESIGN_STORE
          );

        const request =
          store.get(
            designId
          );

        request.onsuccess =
          () => {
            resolve(
              (
                request.result as
                  | GuestDesignRecord
                  | undefined
              ) ??
                null
            );
          };

        request.onerror =
          () => {
            reject(
              request.error ??
                new Error(
                  "Unable to load guest design."
                )
            );
          };
      }
    );
  } finally {
    database.close();
  }
}

// =========================================================
// DELETE GUEST DESIGN
//
// We'll use this later when:
// - cart item is deleted
// - order completes
// - customer intentionally removes a design
// =========================================================

export async function deleteGuestDesign(
  designId: string
): Promise<void> {
  const database =
    await openDatabase();

  try {
    await new Promise<void>(
      (
        resolve,
        reject
      ) => {
        const transaction =
          database.transaction(
            GUEST_DESIGN_STORE,
            "readwrite"
          );

        const store =
          transaction.objectStore(
            GUEST_DESIGN_STORE
          );

        store.delete(
          designId
        );

        transaction.oncomplete =
          () => {
            resolve();
          };

        transaction.onerror =
          () => {
            reject(
              transaction.error ??
                new Error(
                  "Unable to delete guest design."
                )
            );
          };

        transaction.onabort =
          () => {
            reject(
              transaction.error ??
                new Error(
                  "Guest design deletion was cancelled."
                )
            );
          };
      }
    );
  } finally {
    database.close();
  }
}

// =========================================================
// CLEAR ALL GUEST DESIGNS
//
// Useful later after successful checkout.
// =========================================================

export async function clearGuestDesigns():
  Promise<void> {
  const database =
    await openDatabase();

  try {
    await new Promise<void>(
      (
        resolve,
        reject
      ) => {
        const transaction =
          database.transaction(
            GUEST_DESIGN_STORE,
            "readwrite"
          );

        const store =
          transaction.objectStore(
            GUEST_DESIGN_STORE
          );

        store.clear();

        transaction.oncomplete =
          () => {
            resolve();
          };

        transaction.onerror =
          () => {
            reject(
              transaction.error ??
                new Error(
                  "Unable to clear guest designs."
                )
            );
          };

        transaction.onabort =
          () => {
            reject(
              transaction.error ??
                new Error(
                  "Guest design clearing was cancelled."
                )
            );
          };
      }
    );
  } finally {
    database.close();
  }
}