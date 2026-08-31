import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  Globe2,
  MapPin,
  PackageCheck,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../../contexts/CartContext";

import {
  useAuth,
} from "../../contexts/AuthContext";

import {
  useRegion,
} from "../../contexts/RegionContext";

import {
  getCountryByCode,
} from "../../data/countries";

import {
  createOrder,
} from "../../services/orderService";

import type {
  CheckoutCustomer,
} from "../../types/order";

import {
  getDeliveryFee,
  type DeliveryZone,
} from "../../data/deliveryPricing";

import {
  sendOrderConfirmationEmail,
} from "../../services/orderEmailService";

// =========================================================
// TEMPORARY INTERNATIONAL DELIVERY
// =========================================================

const INTERNATIONAL_DELIVERY_FEE =
  6000;

export default function Checkout() {
  const navigate =
    useNavigate();

  const {
    items,
    subtotal,
    clearCart,
  } =
    useCart();

  const {
    user,
  } =
    useAuth();

  const {
    country,
    currency,
    formatPrice,
  } =
    useRegion();

  // =========================================================
  // SELECTED COUNTRY
  // =========================================================

  const selectedCountry =
    getCountryByCode(
      country
    );

  const countryName =
    selectedCountry?.name ??
    country;

  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  // =========================================================
  // DELIVERY
  // =========================================================

  const [
    deliveryZone,
    setDeliveryZone,
  ] =
    useState<DeliveryZone>(
      "colombo"
    );

  const isSriLanka =
    country ===
    "LK";

  const deliveryFee =
    isSriLanka
      ? getDeliveryFee(
          deliveryZone
        )
      : INTERNATIONAL_DELIVERY_FEE;

  const total =
    subtotal +
    deliveryFee;

  // =========================================================
  // CUSTOMER
  // =========================================================

  const [
    customer,
    setCustomer,
  ] =
    useState<CheckoutCustomer>({
      name:
        "",

      email:
        user?.email ??
        "",

      phone:
        "",

      addressLine1:
        "",

      addressLine2:
        "",

      city:
        "",

      postalCode:
        "",

      notes:
        "",
    });

  // =========================================================
  // PREFILL SIGNED-IN EMAIL / NAME
  // =========================================================

  useEffect(() => {
    if (
      !user
    ) {
      return;
    }

    const possibleName =
      typeof user.user_metadata
        ?.full_name ===
      "string"
        ? user.user_metadata
            .full_name
        : "";

    setCustomer(
      (
        previous
      ) => ({
        ...previous,

        name:
          previous.name ||
          possibleName,

        email:
          previous.email ||
          user.email ||
          "",
      })
    );
  }, [
    user,
  ]);

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (
    items.length ===
      0 &&
    !submitting
  ) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">

        <PackageCheck
          size={48}
          className="mx-auto text-gray-400"
        />

        <h1 className="mt-5 text-3xl font-bold">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add something to your cart before checking out.
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
  // CHANGE FIELD
  // =========================================================

  function updateField(
    field:
      keyof CheckoutCustomer,

    value:
      string
  ) {
    setCustomer(
      (
        previous
      ) => ({
        ...previous,

        [field]:
          value,
      })
    );
  }

  // =========================================================
  // VALIDATION
  // =========================================================

  function validate() {
    if (
      !customer.name.trim()
    ) {
      return "Please enter your name.";
    }

    if (
      !customer.email.trim()
    ) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        customer.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      !customer.phone.trim()
    ) {
      return "Please enter your phone number.";
    }

    if (
      !customer.addressLine1.trim()
    ) {
      return "Please enter your delivery address.";
    }

    if (
      !customer.city.trim()
    ) {
      return "Please enter your city.";
    }

    return null;
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      submitting
    ) {
      return;
    }

    const validationError =
      validate();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    setSubmitting(
      true
    );

    setError(
      ""
    );

    try {
      const order =
        await createOrder({
          userId:
            user?.id,

          customer,

          items,

          subtotal,

          deliveryFee,
        });

        try {
          await sendOrderConfirmationEmail({
            customerName: customer.name,
            customerEmail: customer.email,
            orderNumber: order.orderNumber,
          });
        } catch (emailError) {
          console.error(
            "Order created, but confirmation email failed:",
            emailError
          );
        }

      clearCart();

      navigate(
        `/order-confirmation/${order.id}`,
        {
          replace:
            true,

          state: {
            orderNumber:
              order.orderNumber,

            total:
              order.total,

            email:
              customer.email,
          },
        }
      );
    } catch (
      submitError
    ) {
      console.error(
        "Unable to place order:",
        submitError
      );

      setError(
        submitError instanceof
          Error
          ? submitError.message
          : "Unable to place your order. Please try again."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      <button
        type="button"
        onClick={() =>
          navigate(
            "/cart"
          )
        }
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 transition hover:text-black"
      >
        <ArrowLeft
          size={18}
        />

        Back to Cart
      </button>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Checkout
        </h1>

        <p className="mt-3 text-gray-500">
          Enter your delivery details to place your order.
        </p>

        {!user && (
          <p className="mt-2 text-sm text-blue-600">
            You can place this order as a guest. No account is required.
          </p>
        )}

      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >

        {/* =================================================
            CUSTOMER DETAILS
        ================================================= */}

        <div className="space-y-8">

          <section className="rounded-2xl border bg-white p-6">

            <div className="mb-6 flex items-center gap-3">

              <MapPin
                size={22}
              />

              <h2 className="text-xl font-bold">
                Delivery Details
              </h2>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* COUNTRY */}

              <div className="sm:col-span-2">

                <span className="mb-2 block text-sm font-medium">
                  Country *
                </span>

                <div className="flex items-center gap-3 rounded-xl border bg-gray-50 px-4 py-3">

                  <Globe2
                    size={18}
                    className="text-gray-500"
                  />

                  <span className="font-medium">
                    {countryName}
                  </span>

                  <span className="ml-auto text-xs font-semibold text-blue-600">
                    {currency}
                  </span>

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Change your country from the selector in the navigation bar.
                </p>

              </div>

              {/* FULL NAME */}

              <label className="sm:col-span-2">

                <span className="mb-2 block text-sm font-medium">
                  Full Name *
                </span>

                <input
                  type="text"
                  value={
                    customer.name
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  autoComplete="name"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

              {/* EMAIL */}

              <label>

                <span className="mb-2 block text-sm font-medium">
                  Email Address *
                </span>

                <input
                  type="email"
                  value={
                    customer.email
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

              {/* PHONE */}

              <label>

                <span className="mb-2 block text-sm font-medium">
                  Phone Number *
                </span>

                <input
                  type="tel"
                  value={
                    customer.phone
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  autoComplete="tel"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

              {/* ADDRESS LINE 1 */}

              <label className="sm:col-span-2">

                <span className="mb-2 block text-sm font-medium">
                  Address Line 1 *
                </span>

                <input
                  type="text"
                  value={
                    customer.addressLine1
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "addressLine1",
                      event.target.value
                    )
                  }
                  autoComplete="address-line1"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

              {/* ADDRESS LINE 2 */}

              <label className="sm:col-span-2">

                <span className="mb-2 block text-sm font-medium">
                  Address Line 2
                </span>

                <input
                  type="text"
                  value={
                    customer.addressLine2
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "addressLine2",
                      event.target.value
                    )
                  }
                  autoComplete="address-line2"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

              {/* CITY */}

              <label>

                <span className="mb-2 block text-sm font-medium">
                  City *
                </span>

                <input
                  type="text"
                  value={
                    customer.city
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "city",
                      event.target.value
                    )
                  }
                  autoComplete="address-level2"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

              {/* POSTAL CODE */}

              <label>

                <span className="mb-2 block text-sm font-medium">
                  Postal Code
                </span>

                <input
                  type="text"
                  value={
                    customer.postalCode
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "postalCode",
                      event.target.value
                    )
                  }
                  autoComplete="postal-code"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

              {/* =====================================
                  SRI LANKA DELIVERY AREA
              ===================================== */}

              {isSriLanka && (
                <label className="sm:col-span-2">

                  <span className="mb-2 block text-sm font-medium">
                    Delivery Area *
                  </span>

                  <select
                    value={
                      deliveryZone
                    }
                    onChange={(
                      event
                    ) =>
                      setDeliveryZone(
                        event.target
                          .value as DeliveryZone
                      )
                    }
                    className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-black"
                  >

                    <option value="colombo">
                      Colombo District —{" "}
                      {formatPrice(
                        getDeliveryFee(
                          "colombo"
                        )
                      )}
                    </option>

                    <option value="outside-colombo">
                      Outside Colombo District —{" "}
                      {formatPrice(
                        getDeliveryFee(
                          "outside-colombo"
                        )
                      )}
                    </option>

                  </select>

                  <p className="mt-2 text-xs text-gray-500">
                    Delivery charges are based on the selected delivery area.
                  </p>

                </label>
              )}

              {/* =====================================
                  INTERNATIONAL DELIVERY
              ===================================== */}

              {!isSriLanka && (
                <div className="sm:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <p className="font-semibold text-blue-900">
                    International Delivery
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    Shipping to{" "}
                    {countryName}{" "}
                    is currently estimated at{" "}
                    <strong>
                      {formatPrice(
                        INTERNATIONAL_DELIVERY_FEE
                      )}
                    </strong>
                    {" "}for this demo.
                  </p>

                </div>
              )}

              {/* ORDER NOTES */}

              <label className="sm:col-span-2">

                <span className="mb-2 block text-sm font-medium">
                  Order Notes
                </span>

                <textarea
                  value={
                    customer.notes
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "notes",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Optional instructions for your order..."
                  className="w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                />

              </label>

            </div>

          </section>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <aside className="h-fit rounded-2xl border bg-white p-6">

          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 space-y-5">

            {items.map(
              (
                item
              ) => (
                <div
                  key={
                    item.id
                  }
                  className="flex gap-4"
                >

                  <img
                    src={
                      item.designPreview ??
                      item.productImage
                    }
                    alt={
                      item.productName
                    }
                    className="h-20 w-20 rounded-lg bg-gray-100 object-contain"
                  />

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold">
                      {
                        item.productName
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.color.toUpperCase()}
                      {" • "}
                      {item.size}
                      {" • "}
                      Qty {item.quantity}
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {formatPrice(
                        item.unitPrice *
                          item.quantity
                      )}
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

          <div className="mt-6 border-t pt-6">

            <div className="flex justify-between">

              <span className="text-gray-600">
                Subtotal
              </span>

              <span>
                {formatPrice(
                  subtotal
                )}
              </span>

            </div>

            <div className="mt-3 flex justify-between gap-4">

              <span className="text-gray-600">
                {isSriLanka
                  ? "Delivery"
                  : "International Delivery"}
              </span>

              <span className="text-right">
                {formatPrice(
                  deliveryFee
                )}
              </span>

            </div>

            <div className="mt-5 flex items-center justify-between border-t pt-5">

              <span className="text-xl font-bold">
                Total
              </span>

              <span className="text-2xl font-black">
                {formatPrice(
                  total
                )}
              </span>

            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">

              {isSriLanka
                ? "Delivery charges are calculated based on your selected delivery area."
                : `International delivery to ${countryName} is using an estimated demo rate.`}

            </p>

          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting
            }
            className="mt-6 w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Placing Order..."
              : "Place Order"}
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            No online payment is required at this stage.
          </p>

        </aside>

      </form>

    </div>
  );
}