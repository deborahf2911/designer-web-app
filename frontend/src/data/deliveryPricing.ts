export const deliveryPricing = {
  colombo: 350,
  outsideColombo: 500,
} as const;

export type DeliveryZone =
  | "colombo"
  | "outside-colombo";

export function getDeliveryFee(
  zone: DeliveryZone
): number {
  return zone === "colombo"
    ? deliveryPricing.colombo
    : deliveryPricing.outsideColombo;
}