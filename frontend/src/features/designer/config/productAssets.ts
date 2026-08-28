import type {
  ProductView,
} from "../../../types/designer";

import type {
  ProductColor,
} from "../../../types/productColor";

import type {
  ProductType,
} from "../../../types/product";

import frontWhite from "../../../assets/products/tshirt/white/front.png";
import backWhite from "../../../assets/products/tshirt/white/back.png";
import leftWhite from "../../../assets/products/tshirt/white/left.png";
import rightWhite from "../../../assets/products/tshirt/white/right.png";

import frontBlack from "../../../assets/products/tshirt/black/front.png";
import backBlack from "../../../assets/products/tshirt/black/back.png";
import leftBlack from "../../../assets/products/tshirt/black/left.png";
import rightBlack from "../../../assets/products/tshirt/black/right.png";

import frontNavy from "../../../assets/products/tshirt/navy/front.png";
import backNavy from "../../../assets/products/tshirt/navy/back.png";
import leftNavy from "../../../assets/products/tshirt/navy/left.png";
import rightNavy from "../../../assets/products/tshirt/navy/right.png";

import frontRed from "../../../assets/products/tshirt/red/front.png";
import backRed from "../../../assets/products/tshirt/red/back.png";
import leftRed from "../../../assets/products/tshirt/red/left.png";
import rightRed from "../../../assets/products/tshirt/red/right.png";

import frontGreen from "../../../assets/products/tshirt/green/front.png";
import backGreen from "../../../assets/products/tshirt/green/back.png";
import leftGreen from "../../../assets/products/tshirt/green/left.png";
import rightGreen from "../../../assets/products/tshirt/green/right.png";

import hoodieFrontWhite from "../../../assets/products/hoodie/white/front.png";
import hoodieBackWhite from "../../../assets/products/hoodie/white/back.png";
import hoodieLeftWhite from "../../../assets/products/hoodie/white/left.png";
import hoodieRightWhite from "../../../assets/products/hoodie/white/right.png";

import hoodieFrontBlack from "../../../assets/products/hoodie/black/front.png";
import hoodieBackBlack from "../../../assets/products/hoodie/black/back.png";
import hoodieLeftBlack from "../../../assets/products/hoodie/black/left.png";
import hoodieRightBlack from "../../../assets/products/hoodie/black/right.png";

import hoodieFrontBrown from "../../../assets/products/hoodie/brown/front.png";
import hoodieBackBrown from "../../../assets/products/hoodie/brown/back.png";
import hoodieLeftBrown from "../../../assets/products/hoodie/brown/left.png";
import hoodieRightBrown from "../../../assets/products/hoodie/brown/right.png";

// import hoodieFrontNavy from "../../../assets/products/hoodie/navy/front.png";
// import hoodieBackNavy from "../../../assets/products/hoodie/navy/back.png";
// import hoodieLeftNavy from "../../../assets/products/hoodie/navy/left.png";
// import hoodieRightNavy from "../../../assets/products/hoodie/navy/right.png";

// import hoodieFrontRed from "../../../assets/products/hoodie/red/front.png";
// import hoodieBackRed from "../../../assets/products/hoodie/red/back.png";
// import hoodieLeftRed from "../../../assets/products/hoodie/red/left.png";
// import hoodieRightRed from "../../../assets/products/hoodie/red/right.png";

import hoodieFrontGreen from "../../../assets/products/hoodie/green/front.png";
import hoodieBackGreen from "../../../assets/products/hoodie/green/back.png";
import hoodieLeftGreen from "../../../assets/products/hoodie/green/left.png";
import hoodieRightGreen from "../../../assets/products/hoodie/green/right.png";

import whiteCapFront from "../../../assets/products/cap/white/front.png";
import whiteCapBack from "../../../assets/products/cap/white/back.png";
import whiteCapLeft from "../../../assets/products/cap/white/left.png";
import whiteCapRight from "../../../assets/products/cap/white/right.png";

import blackCapFront from "../../../assets/products/cap/black/front.png";
import blackCapBack from "../../../assets/products/cap/black/back.png";
import blackCapLeft from "../../../assets/products/cap/black/left.png";
import blackCapRight from "../../../assets/products/cap/black/right.png";

type ProductAssetConfig =
  Partial<
    Record<
      ProductType,
      Partial<
        Record<
          ProductColor,
          Partial<
            Record<
              ProductView,
              string
            >
          >
        >
      >
    >
  >;

export const productAssets:
  ProductAssetConfig = {
    tshirt: {
        white: {
          front: frontWhite,
          back: backWhite,
          left: leftWhite,
          right: rightWhite,
        },

        black: {
          front: frontBlack,
          back: backBlack,
          left: leftBlack,
          right: rightBlack,
        },

        navy: {
          front: frontNavy,
          back: backNavy,
          left: leftNavy,
          right: rightNavy,
        },

        red: {
          front: frontRed,
          back: backRed,
          left: leftRed,
          right: rightRed,
        },

        green: {
          front: frontGreen,
          back: backGreen,
          left: leftGreen,
          right: rightGreen,
        },
    },

    hoodie: {
        white: {
          front: hoodieFrontWhite,
          back: hoodieBackWhite,
          left: hoodieLeftWhite,
          right: hoodieRightWhite,
        },

        black: {
          front: hoodieFrontBlack,
          back: hoodieBackBlack,
          left: hoodieLeftBlack,
          right: hoodieRightBlack,
        },

        brown: {
          front: hoodieFrontBlack,
          back: hoodieBackBlack,
          left: hoodieLeftBlack,
          right: hoodieRightBlack,
        },

        // navy: {
        // front: hoodieFrontNavy,
        // back: hoodieBackNavy,
        // left: hoodieLeftNavy,
        // right: hoodieRightNavy,
        // },

        // red: {
        // front: hoodieFrontRed,
        // back: hoodieBackRed,
        // left: hoodieLeftRed,
        // right: hoodieRightRed,
        // },

        green: {
          front: hoodieFrontGreen,
          back: hoodieBackGreen,
          left: hoodieLeftGreen,
          right: hoodieRightGreen,
        },
    },

    cap: {
      white: {
        front: whiteCapFront,
        back: whiteCapBack,
        left: whiteCapLeft,
        right: whiteCapRight,
      },

      black: {
        front: blackCapFront,
        back: blackCapBack,
        left: blackCapLeft,
        right: blackCapRight,
      },
    },
  };