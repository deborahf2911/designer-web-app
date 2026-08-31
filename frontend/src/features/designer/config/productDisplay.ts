import type {
  ProductView,
} from "../../../types/designer";

import type {
  ProductType,
} from "../../../types/product";

export interface ProductDisplaySettings {
  width: number;

  left: number;

  top: number;
}

type ProductDisplayConfig =
  Partial<
    Record<
      ProductType,
      Partial<
        Record<
          ProductView,
          ProductDisplaySettings
        >
      >
    >
  >;

export const productDisplay:
  ProductDisplayConfig = {

    // =====================================================
    // CLASSIC T-SHIRT
    // =====================================================

    tshirt: {
      front: {
        width: 247,
        left: 350,
        top: 350,
      },

      back: {
        width: 233,
        left: 350,
        top: 350,
      },

      left: {
        width: 118,
        left: 350,
        top: 350,
      },

      right: {
        width: 118,
        left: 350,
        top: 350,
      },
    },

    // =====================================================
    // POLO
    // =====================================================

    polo: {
      front: {
        width: 260,
        left: 350,
        top: 350,
      },

      back: {
        width: 260,
        left: 350,
        top: 350,
      },

      left: {
        width: 150,
        left: 350,
        top: 350,
      },

      right: {
        width: 150,
        left: 350,
        top: 350,
      },
    },

    // =====================================================
    // OVERSIZED T-SHIRT
    // =====================================================

    "oversized-tshirt": {
      front: {
        width: 330,
        left: 350,
        top: 350,
      },
    },

    // =====================================================
    // CLASSIC HOODIE
    // =====================================================

    hoodie: {
      front: {
        width: 290,
        left: 350,
        top: 350,
      },

      back: {
        width: 285,
        left: 350,
        top: 350,
      },

      left: {
        width: 270,
        left: 350,
        top: 350,
      },

      right: {
        width: 270,
        left: 350,
        top: 350,
      },
    },

    // =====================================================
    // ZIP HOODIE
    // =====================================================

    "zip-hoodie": {
      front: {
        width: 320,
        left: 350,
        top: 350,
      },
    },

    // =====================================================
    // OVERSIZED HOODIE
    // =====================================================

    "oversized-hoodie": {
      front: {
        width: 300,
        left: 350,
        top: 350,
      },

      back: {
        width: 300,
        left: 350,
        top: 350,
      },

      left: {
        width: 220,
        left: 350,
        top: 350,
      },

      right: {
        width: 220,
        left: 350,
        top: 350,
      },
    },

    // =====================================================
    // CAP
    // =====================================================

    cap: {
      front: {
        width: 300,
        left: 350,
        top: 350,
      },

      back: {
        width: 300,
        left: 350,
        top: 350,
      },

      left: {
        width: 320,
        left: 350,
        top: 350,
      },

      right: {
        width: 320,
        left: 350,
        top: 350,
      },
    },
  };