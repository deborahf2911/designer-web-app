import type {
  CountryCode,
} from "./countries";

// =========================================================
// SRI LANKA DELIVERY
// =========================================================

export type DeliveryZone =
  | "colombo"
  | "outside-colombo";

const deliveryFees: Record<
  DeliveryZone,
  number
> = {
  colombo:
    350,

  "outside-colombo":
    500,
};

export function getDeliveryFee(
  zone:
    DeliveryZone
) {
  return deliveryFees[
    zone
  ];
}

// =========================================================
// INTERNATIONAL DELIVERY
// =========================================================
//
// IMPORTANT:
// These are temporary configurable rates in LKR.
// Replace them with the customer's confirmed courier
// rates before production deployment.
//
// Countries not listed here require a shipping quote.
// =========================================================

const internationalDeliveryFees:
  Partial<
    Record<
      CountryCode,
      number
    >
  > = {
    AU:
      8500,

    GB:
      9500,

    US:
      10500,
  };

// =========================================================
// GET INTERNATIONAL DELIVERY FEE
// =========================================================

export function getInternationalDeliveryFee(
  country:
    CountryCode
): number | null {
  return (
    internationalDeliveryFees[
      country
    ] ??
    null
  );
}

// =========================================================
// CHECK WHETHER COUNTRY HAS FIXED SHIPPING
// =========================================================

export function hasFixedInternationalDelivery(
  country:
    CountryCode
) {
  return (
    getInternationalDeliveryFee(
      country
    ) !== null
  );
}