import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  products,
} from "../../data/products";

import {
  productAssets,
} from "../../features/designer/config/productAssets";

import type {
  Product as ProductType,
} from "../../types/product";

import type {
  ProductColor,
} from "../../types/productColor";


interface ProductContentProps {
  product: ProductType;
}


function ProductContent({
  product,
}: ProductContentProps) {
  const navigate =
    useNavigate();

  const [
    selectedColor,
    setSelectedColor,
  ] =
    useState<ProductColor>(
      product.colors[0]
    );

  const [
    selectedSize,
    setSelectedSize,
  ] =
    useState(
      product.sizes[1] ??
      product.sizes[0] ??
      ""
    );

  const [
    quantity,
    setQuantity,
  ] =
    useState(1);


  const selectedProductImage =
    productAssets[
      product.type
    ]?.[
      selectedColor
    ]?.front ??
    product.image;


  const size =
    selectedSize ??
    product.sizes[0] ??
    "";


  const getColorValue = (
    color: ProductColor
  ) => {
    switch (color) {
      case "white":
        return "#ffffff";

      case "off-white":
        return "#eee9df";

      case "black":
        return "#000000";

      case "navy":
        return "#172554";

      case "red":
        return "#dc2626";

      case "green":
        return "#16a34a";

      case "brown":
        return "#8b5e3c";

      default:
        return "#d1d5db";
    }
  };


  return (
    <div className="mx-auto max-w-7xl p-10">

      <div className="grid gap-12 lg:grid-cols-2">

        {/* PRODUCT IMAGE */}

        <div>
          <img
            src={
              selectedProductImage
            }
            alt={`${product.name} - ${selectedColor}`}
            className="h-full w-full object-contain"
          />
        </div>


        {/* PRODUCT DETAILS */}

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-4 text-gray-600">
            {product.description}
          </p>


          {/* COLOR */}

          <div className="mt-8">

            <p className="mb-3 font-semibold">
              Color
            </p>

            <div className="flex gap-3">

              {product.colors.map(
                (color) => (

                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setSelectedColor(
                        color
                      )
                    }
                    aria-label={`Select ${color}`}
                    className={`h-10 w-10 rounded-full border-2 ${
                      selectedColor ===
                      color
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor:
                        getColorValue(
                          color
                        ),
                    }}
                  />

                )
              )}

            </div>

          </div>


          {/* SIZE */}

          <div className="mt-8">

            <p className="mb-3 font-semibold">
              Size
            </p>

            <div className="flex gap-3">

              {product.sizes.map(
                (productSize) => (

                  <button
                    key={
                      productSize
                    }
                    type="button"
                    onClick={() =>
                      setSelectedSize(
                        productSize
                      )
                    }
                    className={`rounded-lg border px-4 py-2 ${
                      selectedSize ===
                      productSize
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    {productSize}
                  </button>

                )
              )}

            </div>

          </div>


          {/* QUANTITY */}

          <div className="mt-8">

            <p className="mb-3 font-semibold">
              Quantity
            </p>

            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity - 1
                    )
                  )
                }
                className="rounded border px-3 py-2"
              >
                -
              </button>

              <span className="text-xl">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    quantity + 1
                  )
                }
                className="rounded border px-3 py-2"
              >
                +
              </button>

            </div>

          </div>


          {/* CUSTOMIZE */}

          <div className="mt-10 flex gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/designer/${product.id}?color=${encodeURIComponent(
                    selectedColor
                  )}&size=${encodeURIComponent(
                    size
                  )}&quantity=${quantity}`
                )
              }
              className="rounded-lg bg-black px-8 py-3 text-white hover:bg-gray-800"
            >
              Customize
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default function Product() {
  const {
    productId,
  } =
    useParams();

  const product =
    products.find(
      (item) =>
        item.id ===
        Number(productId)
    );

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <ProductContent
      product={product}
    />
  );
}