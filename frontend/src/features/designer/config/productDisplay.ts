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