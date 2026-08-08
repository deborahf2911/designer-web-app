import type { ProductView } from "../../../types/designer";

export interface PrintArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const printAreas: Record<ProductView, PrintArea> = {
  front: {
    left: 25,
    top: 45,
    width: 180,
    height: 220,
},

  back: {
    left: 227,
    top: 150,
    width: 247,
    height: 314,
  },

  left: {
    left: 250,
    top: 170,
    width: 160,
    height: 220,
  },

  right: {
    left: 250,
    top: 170,
    width: 160,
    height: 220,
  },
};