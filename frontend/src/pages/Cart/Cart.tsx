import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../../contexts/CartContext";

import {
  customizationPricing,
} from "../../data/customizationPricing";

import {
  useRegion,
} from "../../contexts/RegionContext";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
  } =
    useCart();

  const navigate =
    useNavigate();

  const {
    formatPrice,
  } =
    useRegion();

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (
    items.length ===
    0
  ) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">

        <h1 className="text-4xl font-bold">
          Your Cart
        </h1>

        <p className="mt-4 text-gray-500">
          Your cart is currently empty.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customize"
            )
          }
          className="mt-8 rounded-xl bg-black px-7 py-3 font-semibold text-white"
        >
          Start Designing
        </button>

      </div>
    );
  }

  // =========================================================
  // CART
  // =========================================================

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      <h1 className="mb-10 text-4xl font-bold">
        Your Cart
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

        {/* =====================================
            CART ITEMS
        ===================================== */}

        <div className="space-y-6">

          {items.map(
            (
              item
            ) => {
              const openDesigner =
                () => {
                  navigate(
                    `/designer/${item.productId}?designId=${encodeURIComponent(
                      item.id
                    )}`
                  );
                };

              return (
                <div
                  key={
                    item.id
                  }
                  className="flex gap-6 rounded-2xl border bg-white p-6"
                >

                  {/* DESIGN PREVIEW */}

                  <button
                    type="button"
                    onClick={
                      openDesigner
                    }
                    className="shrink-0 rounded-xl text-left transition hover:opacity-90"
                    aria-label={`Modify ${item.productName} design`}
                  >
                    <img
                      src={
                        item.designPreview ??
                        item.productImage
                      }
                      alt={
                        item.productName
                      }
                      className="h-40 w-40 rounded-xl bg-gray-100 object-contain"
                    />
                  </button>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-4">

                      <button
                        type="button"
                        onClick={
                          openDesigner
                        }
                        className="text-left"
                      >

                        <h2 className="text-xl font-bold transition hover:text-blue-600">
                          {
                            item.productName
                          }
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.color.toUpperCase()}
                          {" • "}
                          Size{" "}
                          {item.size}
                        </p>

                        {item.customized && (
                          <p className="mt-1 text-xs font-medium text-blue-600">
                            Click to modify design
                          </p>
                        )}

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(
                            item.id
                          )
                        }
                        className="text-red-600 transition hover:text-red-700"
                        aria-label={`Remove ${item.productName} from cart`}
                      >
                        <Trash2
                          size={20}
                        />
                      </button>

                    </div>

                    {/* PRICE BREAKDOWN */}

                    {item.customized && (
                      <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm">

                        <p className="mb-2 font-semibold">
                          Price Breakdown
                        </p>

                        <div className="flex justify-between">

                          <span>
                            Base{" "}
                            {item.productName}
                          </span>

                          <span>
                            {formatPrice(
                              item.basePrice
                            )}
                          </span>

                        </div>

                        {item.customization.textCount >
                          0 && (
                          <div className="mt-1 flex justify-between">

                            <span>
                              Custom Text ×{" "}
                              {item.customization.textCount}
                            </span>

                            <span>
                              {formatPrice(
                                item.customization.textCount *
                                  customizationPricing.text
                              )}
                            </span>

                          </div>
                        )}

                        {item.customization.imageCount >
                          0 && (
                          <div className="mt-1 flex justify-between">

                            <span>
                              Custom Image ×{" "}
                              {item.customization.imageCount}
                            </span>

                            <span>
                              {formatPrice(
                                item.customization.imageCount *
                                  customizationPricing.image
                              )}
                            </span>

                          </div>
                        )}

                        {item.customization.premiumFontUsed && (
                          <div className="mt-1 flex justify-between">

                            <span>
                              Premium Font
                            </span>

                            <span>
                              {formatPrice(
                                customizationPricing.premiumFont
                              )}
                            </span>

                          </div>
                        )}

                        <div className="mt-3 flex justify-between border-t pt-3 font-semibold">

                          <span>
                            Price per item
                          </span>

                          <span>
                            {formatPrice(
                              item.unitPrice
                            )}
                          </span>

                        </div>

                      </div>
                    )}

                    {/* QUANTITY */}

                    <div className="mt-6 flex items-center justify-between">

                      <div className="flex items-center rounded-lg border">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity -
                                1
                            )
                          }
                          className="p-2"
                          aria-label="Decrease quantity"
                        >
                          <Minus
                            size={16}
                          />
                        </button>

                        <span className="min-w-10 text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity +
                                1
                            )
                          }
                          className="p-2"
                          aria-label="Increase quantity"
                        >
                          <Plus
                            size={16}
                          />
                        </button>

                      </div>

                      <p className="text-xl font-bold">
                        {formatPrice(
                          item.unitPrice *
                            item.quantity
                        )}
                      </p>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* =====================================
            ORDER SUMMARY
        ===================================== */}

        <aside className="h-fit rounded-2xl border bg-white p-6">

          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between">

            <span className="text-gray-600">
              Subtotal
            </span>

            <span className="font-semibold">
              {formatPrice(
                subtotal
              )}
            </span>

          </div>

          <div className="mt-4 flex justify-between gap-4">

            <span className="text-gray-600">
              Delivery
            </span>

            <span className="text-right">
              Calculated at checkout
            </span>

          </div>

          <div className="mt-6 border-t pt-6">

            <div className="flex items-center justify-between">

              <span className="text-xl font-bold">
                Total
              </span>

              <span className="text-2xl font-black">
                {formatPrice(
                  subtotal
                )}
              </span>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/checkout"
              )
            }
            className="mt-6 w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Proceed to Checkout
          </button>

        </aside>

      </div>

    </div>
  );
}