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
  countryOptions,
  getCountryByCode,
  type CountryCode,
} from "../../data/countries";

import {
  createOrder,
} from "../../services/orderService";

import type {
  CheckoutCustomer,
} from "../../types/order";

import {
  getDeliveryFee,
  getInternationalDeliveryFee,
  type DeliveryZone,
} from "../../data/deliveryPricing";

import {
  sendOrderConfirmationEmail,
} from "../../services/orderEmailService";


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
    setCountry,
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
    country === "LK";

  // =========================================================
  // INTERNATIONAL SHIPPING
  // =========================================================

  const internationalDeliveryFee =
    !isSriLanka
      ? getInternationalDeliveryFee(
          country
        )
      : null;

  const hasInternationalRate =
    internationalDeliveryFee !==
    null;

  // =========================================================
  // CHECKOUT AVAILABILITY
  // =========================================================

  const canPlaceOrder =
    isSriLanka ||
    hasInternationalRate;

  // =========================================================
  // DELIVERY FEE
  // =========================================================

  const deliveryFee =
    isSriLanka
      ? getDeliveryFee(
          deliveryZone
        )
      : internationalDeliveryFee ??
        0;

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
      !canPlaceOrder
    ) {
      setError(
        `Delivery to ${countryName} requires a shipping quote. Please contact Kingdom Threads before placing your order.`
      );

      return;
    }

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

      // =====================================================
      // SEND CONFIRMATION EMAIL
      // =====================================================

      try {
        await sendOrderConfirmationEmail({
          customerName:
            customer.name,

          customerEmail:
            customer.email,

          orderNumber:
            order.orderNumber,
        });
      } catch (
        emailError
      ) {
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

              {/* =====================================
                  COUNTRY
              ===================================== */}

              <label className="sm:col-span-2">

                <span className="mb-2 block text-sm font-medium">
                  Country *
                </span>

                <div className="relative">

                  <Globe2
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <select
                    value={
                      country
                    }
                    onChange={(
                      event
                    ) => {
                      setCountry(
                        event.target
                          .value as CountryCode
                      );

                      setError(
                        ""
                      );
                    }}
                    autoComplete="country"
                    className="w-full appearance-none rounded-xl border bg-white py-3 pl-11 pr-20 outline-none transition focus:border-black"
                  >

                    {countryOptions.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option.code
                          }
                          value={
                            option.code
                          }
                        >
                          {option.flag}{" "}
                          {option.name}
                        </option>
                      )
                    )}

                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600">
                    {currency}
                  </span>

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Select the country where this order will be delivered.
                </p>

              </label>

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
                <div
                  className={
                    hasInternationalRate
                      ? "sm:col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-4"
                      : "sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4"
                  }
                >

                  <p
                    className={
                      hasInternationalRate
                        ? "font-semibold text-blue-900"
                        : "font-semibold text-amber-900"
                    }
                  >
                    International Shipping
                  </p>

                  {hasInternationalRate ? (
                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      Delivery to{" "}
                      <strong>
                        {countryName}
                      </strong>{" "}
                      is available for{" "}
                      <strong>
                        {formatPrice(
                          deliveryFee
                        )}
                      </strong>
                      .
                    </p>
                  ) : (
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      Delivery to{" "}
                      <strong>
                        {countryName}
                      </strong>{" "}
                      requires a shipping quote.
                      Please contact Kingdom Threads
                      before placing your order.
                    </p>
                  )}

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

            {/* SUBTOTAL */}

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

            {/* DELIVERY */}

            <div className="mt-3 flex justify-between gap-4">

              <span className="text-gray-600">
                {isSriLanka
                  ? "Delivery"
                  : "International Delivery"}
              </span>

              <span className="text-right">
                {canPlaceOrder
                  ? formatPrice(
                      deliveryFee
                    )
                  : "Quote required"}
              </span>

            </div>

            {/* TOTAL / SUBTOTAL */}

            <div className="mt-5 flex items-center justify-between border-t pt-5">

              <span className="text-xl font-bold">
                {canPlaceOrder
                  ? "Total"
                  : "Subtotal"}
              </span>

              <span className="text-2xl font-black">
                {formatPrice(
                  total
                )}
              </span>

            </div>

            {/* DELIVERY INFORMATION */}

            <p className="mt-3 text-xs leading-5 text-gray-500">

              {isSriLanka
                ? "Delivery charges are calculated based on your selected delivery area."
                : hasInternationalRate
                  ? `International delivery to ${countryName} is included in the total shown above.`
                  : `International shipping to ${countryName} requires a separate delivery quote.`}

            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* PLACE ORDER */}

          <button
            type="submit"
            disabled={
              submitting ||
              !canPlaceOrder
            }
            className="mt-6 w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Placing Order..."
              : canPlaceOrder
                ? "Place Order"
                : "International Shipping Quote Required"}
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            No online payment is required at this stage.
          </p>

        </aside>

      </form>

    </div>
  );
}