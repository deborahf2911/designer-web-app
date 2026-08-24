import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useCart } from "../../contexts/CartContext";
import { customizationPricing } from "../../data/customizationPricing";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold">
          Your Cart
        </h1>

        <p className="mt-4 text-gray-500">
          Your cart is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      <h1 className="mb-10 text-4xl font-bold">
        Your Cart
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

        <div className="space-y-6">

          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 rounded-2xl border bg-white p-6"
            >
              <img
                src={item.designPreview ?? item.productImage}
                alt={item.productName}
                className="h-40 w-40 rounded-xl bg-gray-100 object-contain"
                />

              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-bold">
                      {item.productName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.color.toUpperCase()}
                      {" • "}
                      Size {item.size}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="text-red-600 transition hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>

                {item.customized && (
                  <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm">

                    <p className="mb-2 font-semibold">
                        Price Breakdown
                    </p>

                    {/* BASE PRODUCT */}
                    <div className="flex justify-between">
                        <span>
                        Base T-Shirt
                        </span>

                        <span>
                        Rs. {item.basePrice.toLocaleString()}
                        </span>
                    </div>

                    {/* TEXT */}
                    {item.customization.textCount > 0 && (
                        <div className="mt-1 flex justify-between">
                            <span>
                            Custom Text × {item.customization.textCount}
                            </span>

                            <span>
                            Rs.{" "}
                            {(
                                item.customization.textCount *
                                customizationPricing.text
                            ).toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* IMAGE */}
                    {item.customization.imageCount > 0 && (
                        <div className="mt-1 flex justify-between">
                            <span>
                            Custom Image × {item.customization.imageCount}
                            </span>

                            <span>
                            Rs.{" "}
                            {(
                                item.customization.imageCount *
                                customizationPricing.image
                            ).toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* PREMIUM FONT */}
                    {item.customization.premiumFontUsed && (
                        <div className="mt-1 flex justify-between">
                        <span>
                            Premium Font
                        </span>

                        <span>
                            Rs. {customizationPricing.premiumFont.toLocaleString()}
                        </span>
                        </div>
                    )}

                    {/* UNIT TOTAL */}
                    <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
                        <span>
                        Price per shirt
                        </span>

                        <span>
                        Rs. {item.unitPrice.toLocaleString()}
                        </span>
                    </div>

                    </div>
                )}

                <div className="mt-6 flex items-center justify-between">

                  <div className="flex items-center rounded-lg border">

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      className="p-2"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-10 text-center">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      className="p-2"
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                  <p className="text-xl font-bold">
                    Rs.{" "}
                    {(
                      item.unitPrice *
                      item.quantity
                    ).toLocaleString()}
                  </p>

                </div>

              </div>
            </div>
          ))}

        </div>

        <aside className="h-fit rounded-2xl border bg-white p-6">

          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between">
            <span className="text-gray-600">
              Subtotal
            </span>

            <span className="font-semibold">
              Rs. {subtotal.toLocaleString()}
            </span>
          </div>

          <div className="mt-4 flex justify-between">
            <span className="text-gray-600">
              Delivery
            </span>

            <span>
              Calculated at checkout
            </span>
          </div>

          <div className="mt-6 border-t pt-6">

            <div className="flex items-center justify-between">

              <span className="text-xl font-bold">
                Total
              </span>

              <span className="text-2xl font-black">
                Rs. {subtotal.toLocaleString()}
              </span>

            </div>

          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Proceed to Checkout
          </button>

        </aside>

      </div>

    </div>
  );
}