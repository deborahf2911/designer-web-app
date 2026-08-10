import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { products } from "../../../data/products";

import type { DesignState } from "../models/design";
import type { ProductColor } from "../../../types/productColor";
import type { ProductView } from "../../../types/designer";
import type { Product } from "../../../types/product";

interface DesignContextType {
  design: DesignState;

  setProduct: (product: Product) => void;

  setColor: (color: ProductColor) => void;

  setCurrentView: (view: ProductView) => void;

  setSize: (size: string) => void;
}

const DesignContext =
  createContext<DesignContextType | null>(null);

export function DesignProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [design, setDesign] = useState({
    product: products[0],

    color: products[0].colors[0],

    size: products[0].sizes[0],

    currentView: "front" as ProductView,

    views: {
      front: null,
      back: null,
      left: null,
      right: null,
    },
  });

  function setProduct(product: Product) {
    setDesign((previous) => ({
      ...previous,
      product,
    }));
  }

  function setColor(color: ProductColor) {
    setDesign((previous) => ({
      ...previous,
      color,
    }));
  }

  function setCurrentView(
    currentView: ProductView
  ) {
    setDesign((previous) => ({
      ...previous,
      currentView,
    }));
  }

  function setSize(size: string) {
    setDesign((previous) => ({
      ...previous,
      size,
    }));
  }

  return (
    <DesignContext.Provider
      value={{
        design,
        setProduct,
        setColor,
        setCurrentView,
        setSize,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);

  if (!context) {
    throw new Error(
      "useDesign must be used inside DesignProvider"
    );
  }

  return context;
}