import type {
  ProductView,
} from "../../../types/designer";

import type {
  ProductColor,
} from "../../../types/productColor";

import type {
  ProductType,
} from "../../../types/product";

// =========================================================
// CLASSIC T-SHIRT
// =========================================================

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

// =========================================================
// POLO
// =========================================================

import poloFrontWhite from "../../../assets/products/polo/white/front.png";
import poloBackWhite from "../../../assets/products/polo/white/back.png";
import poloLeftWhite from "../../../assets/products/polo/white/left.png";
import poloRightWhite from "../../../assets/products/polo/white/right.png";

import poloFrontBlack from "../../../assets/products/polo/black/front.png";
import poloBackBlack from "../../../assets/products/polo/black/back.png";
import poloLeftBlack from "../../../assets/products/polo/black/left.png";
import poloRightBlack from "../../../assets/products/polo/black/right.png";

import poloFrontGreen from "../../../assets/products/polo/green/front.png";
import poloBackGreen from "../../../assets/products/polo/green/back.png";
import poloLeftGreen from "../../../assets/products/polo/green/left.png";
import poloRightGreen from "../../../assets/products/polo/green/right.png";

// =========================================================
// OVERSIZED T-SHIRT
// =========================================================

import oversizedTshirtFrontWhite from "../../../assets/products/oversized-tshirt/white/front.png";

// =========================================================
// CLASSIC HOODIE
// =========================================================

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

import hoodieFrontGreen from "../../../assets/products/hoodie/green/front.png";
import hoodieBackGreen from "../../../assets/products/hoodie/green/back.png";
import hoodieLeftGreen from "../../../assets/products/hoodie/green/left.png";
import hoodieRightGreen from "../../../assets/products/hoodie/green/right.png";

// =========================================================
// ZIP HOODIE
// =========================================================

import zipHoodieFrontWhite from "../../../assets/products/zip-hoodie/white/front.png";

// =========================================================
// OVERSIZED HOODIE
// =========================================================

import oversizedHoodieFrontOffWhite from "../../../assets/products/oversized-hoodie/off-white/front.png";
import oversizedHoodieBackOffWhite from "../../../assets/products/oversized-hoodie/off-white/back.png";
import oversizedHoodieLeftOffWhite from "../../../assets/products/oversized-hoodie/off-white/left.png";
import oversizedHoodieRightOffWhite from "../../../assets/products/oversized-hoodie/off-white/right.png";

// =========================================================
// CAP
// =========================================================

import whiteCapFront from "../../../assets/products/cap/white/front.png";
import whiteCapBack from "../../../assets/products/cap/white/back.png";
import whiteCapLeft from "../../../assets/products/cap/white/left.png";
import whiteCapRight from "../../../assets/products/cap/white/right.png";

import blackCapFront from "../../../assets/products/cap/black/front.png";
import blackCapBack from "../../../assets/products/cap/black/back.png";
import blackCapLeft from "../../../assets/products/cap/black/left.png";
import blackCapRight from "../../../assets/products/cap/black/right.png";

// =========================================================
// TYPE
// =========================================================

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

// =========================================================
// PRODUCT ASSETS
// =========================================================

export const productAssets:
  ProductAssetConfig = {

    // =====================================================
    // CLASSIC T-SHIRT
    // =====================================================

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

    // =====================================================
    // POLO
    // =====================================================

    polo: {
      white: {
        front: poloFrontWhite,
        back: poloBackWhite,
        left: poloLeftWhite,
        right: poloRightWhite,
      },

      black: {
        front: poloFrontBlack,
        back: poloBackBlack,
        left: poloLeftBlack,
        right: poloRightBlack,
      },

      green: {
        front: poloFrontGreen,
        back: poloBackGreen,
        left: poloLeftGreen,
        right: poloRightGreen,
      },
    },

    // =====================================================
    // OVERSIZED T-SHIRT
    // =====================================================

    "oversized-tshirt": {
      white: {
        front: oversizedTshirtFrontWhite,
      },
    },

    // =====================================================
    // CLASSIC HOODIE
    // =====================================================

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
        front: hoodieFrontBrown,
        back: hoodieBackBrown,
        left: hoodieLeftBrown,
        right: hoodieRightBrown,
      },

      green: {
        front: hoodieFrontGreen,
        back: hoodieBackGreen,
        left: hoodieLeftGreen,
        right: hoodieRightGreen,
      },
    },

    // =====================================================
    // ZIP HOODIE
    // =====================================================

    "zip-hoodie": {
      white: {
        front: zipHoodieFrontWhite,
      },
    },

    // =====================================================
    // OVERSIZED HOODIE
    // =====================================================

    "oversized-hoodie": {
      "off-white": {
        front: oversizedHoodieFrontOffWhite,
        back: oversizedHoodieBackOffWhite,
        left: oversizedHoodieLeftOffWhite,
        right: oversizedHoodieRightOffWhite,
      },
    },

    // =====================================================
    // CAP
    // =====================================================

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