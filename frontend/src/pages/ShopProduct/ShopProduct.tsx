import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";

import {
  shopProducts,
} from "../../data/shopProducts";

import {
  useCart,
} from "../../contexts/CartContext";

export default function ShopProduct() {
  const {
    productId,
  } =
    useParams();

  const navigate =
    useNavigate();

  const {
    addItem,
  } =
    useCart();

  const product =
    shopProducts.find(
      (item) =>
        item.id ===
        Number(productId)
    );

  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-4xl px-6 py-20 text-center">

          <h1 className="text-2xl font-bold">
            Product not found
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/shop"
              )
            }
            className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
          >
            Back to Shop
          </button>

        </div>

      </main>
    );
  }

  // =========================================
  // STATE
  // =========================================

  const [
    selectedColor,
    setSelectedColor,
  ] =
    useState(
      product.colors[0]
    );

  const [
    selectedSize,
    setSelectedSize,
  ] =
    useState(
      product.sizes[0] ??
        ""
    );

  const [
    quantity,
    setQuantity,
  ] =
    useState(1);

  // =========================================
  // ADD TO CART
  // =========================================

  function handleAddToCart() {
    if (!product) {
        return;
    }

    const cartItem = {
        id:
        crypto.randomUUID(),

        productId:
        product.id,

        productName:
        product.name,

        productImage:
        product.image,

        designPreview:
        product.image,

        color:
        selectedColor,

        size:
        selectedSize,

        quantity,

        basePrice:
        product.price,

        customized:
        false,

        customization: {
        textCount:
            0,

        imageCount:
            0,

        premiumFontUsed:
            false,
        },

        customizationPrice:
        0,

        unitPrice:
        product.price,
    };

    addItem(
        cartItem
    );

    navigate(
        "/cart"
    );
    }

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/shop"
            )
          }
          className="mb-8 flex items-center gap-2 text-sm text-gray-600 transition hover:text-black"
        >
          <ArrowLeft
            size={18}
          />

          Back to Shop
        </button>

        <div className="grid gap-12 lg:grid-cols-2">

          {/* =====================================
              IMAGE
          ===================================== */}

          <div className="flex min-h-[520px] items-center justify-center rounded-3xl bg-white p-8">

            <img
              src={
                product.image
              }
              alt={
                product.name
              }
              className="max-h-[500px] w-full object-contain"
            />

          </div>

          {/* =====================================
              DETAILS
          ===================================== */}

          <div className="flex flex-col justify-center">

            <p className="font-semibold uppercase tracking-[0.25em] text-blue-600">
              Ready-Made Product
            </p>

            <h1 className="mt-3 text-4xl font-black">
              {
                product.name
              }
            </h1>

            <p className="mt-5 leading-7 text-gray-600">
              {
                product.description
              }
            </p>

            <p className="mt-6 text-3xl font-black">
              Rs.{" "}
              {product.price.toLocaleString()}
            </p>

            {/* =====================================
                COLOR
            ===================================== */}

            {product.colors.length >
              0 && (
              <div className="mt-8">

                <p className="font-semibold">
                  Color
                </p>

                <div className="mt-3 flex flex-wrap gap-3">

                  {product.colors.map(
                    (color) => (

                      <button
                        key={
                          color
                        }
                        type="button"
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                          selectedColor ===
                          color
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white hover:border-gray-500"
                        }`}
                      >
                        {
                          color
                        }
                      </button>

                    )
                  )}

                </div>

              </div>
            )}

            {/* =====================================
                SIZE
            ===================================== */}

            {product.sizes.length >
              0 && (
              <div className="mt-7">

                <p className="font-semibold">
                  Size
                </p>

                <div className="mt-3 flex flex-wrap gap-3">

                  {product.sizes.map(
                    (size) => (

                      <button
                        key={
                          size
                        }
                        type="button"
                        onClick={() =>
                          setSelectedSize(
                            size
                          )
                        }
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          selectedSize ===
                          size
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white hover:border-gray-500"
                        }`}
                      >
                        {
                          size
                        }
                      </button>

                    )
                  )}

                </div>

              </div>
            )}

            {/* =====================================
                QUANTITY
            ===================================== */}

            <div className="mt-7">

              <p className="font-semibold">
                Quantity
              </p>

              <div className="mt-3 flex w-fit items-center rounded-lg border border-gray-300 bg-white">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (
                        previous
                      ) =>
                        Math.max(
                          1,
                          previous -
                            1
                        )
                    )
                  }
                  className="p-3 transition hover:bg-gray-100"
                >
                  <Minus
                    size={
                      17
                    }
                  />
                </button>

                <span className="min-w-12 text-center font-semibold">
                  {
                    quantity
                  }
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (
                        previous
                      ) =>
                        previous +
                        1
                    )
                  }
                  className="p-3 transition hover:bg-gray-100"
                >
                  <Plus
                    size={
                      17
                    }
                  />
                </button>

              </div>

            </div>

            {/* =====================================
                TOTAL
            ===================================== */}

            <div className="mt-8 border-t border-gray-200 pt-6">

              <div className="flex items-center justify-between">

                <span className="text-gray-600">
                  Total
                </span>

                <span className="text-2xl font-black">
                  Rs.{" "}
                  {(
                    product.price *
                    quantity
                  ).toLocaleString()}
                </span>

              </div>

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}