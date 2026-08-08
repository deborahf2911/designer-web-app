import type { ProductView } from "../../../types/designer";

export const productDisplay = {
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
} satisfies Record<
  string,
  Record<
    ProductView,
    {
      width: number;
      left: number;
      top: number;
    }
  >
>;