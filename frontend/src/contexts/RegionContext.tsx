import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCountryByCode,
  type CountryCode,
  type CurrencyCode,
} from "../data/countries";

// =========================================================
// TYPES
// =========================================================

interface RegionContextValue {
  country: CountryCode;

  currency: CurrencyCode;

  setCountry:
    (
      country:
        CountryCode
    ) => void;

  setCurrency:
    (
      currency:
        CurrencyCode
    ) => void;

  formatPrice:
    (
      amountInLkr:
        number
    ) => string;

  exchangeRateLoading:
    boolean;
}

// =========================================================
// CONTEXT
// =========================================================

const RegionContext =
  createContext<
    RegionContextValue | undefined
  >(undefined);

// =========================================================
// CONSTANTS
// =========================================================

const BASE_CURRENCY =
  "LKR";

const EXCHANGE_API =
  "https://api.frankfurter.dev/v2/rate";

// =========================================================
// PROVIDER
// =========================================================

export function RegionProvider({
  children,
}: {
  children:
    ReactNode;
}) {
  const [
    country,
    setCountryState,
  ] =
    useState<CountryCode>(
      "LK"
    );

  const [
    currency,
    setCurrencyState,
  ] =
    useState<CurrencyCode>(
      "LKR"
    );

  const [
    exchangeRate,
    setExchangeRate,
  ] =
    useState<number>(
      1
    );

  const [
    exchangeRateLoading,
    setExchangeRateLoading,
  ] =
    useState(
      false
    );

  // =======================================================
  // FETCH EXCHANGE RATE
  // =======================================================

  const fetchExchangeRate =
    useCallback(
      async (
        targetCurrency:
          CurrencyCode
      ) => {
        // LKR does not require conversion.
        if (
          targetCurrency ===
          BASE_CURRENCY
        ) {
          setExchangeRate(
            1
          );

          setExchangeRateLoading(
            false
          );

          return;
        }

        setExchangeRateLoading(
          true
        );

        try {
          const response =
            await fetch(
              `${EXCHANGE_API}/${BASE_CURRENCY}/${targetCurrency}`
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `Unable to retrieve ${targetCurrency} exchange rate.`
            );
          }

          const data:
            {
              date?: string;
              base?: string;
              quote?: string;
              rate?: number;
            } =
            await response.json();

          if (
            typeof data.rate !==
              "number" ||
            !Number.isFinite(
              data.rate
            )
          ) {
            throw new Error(
              `Invalid ${targetCurrency} exchange rate received.`
            );
          }

          setExchangeRate(
            data.rate
          );
        } catch (
          error
        ) {
          console.error(
            `Unable to load LKR → ${targetCurrency} exchange rate:`,
            error
          );

          /*
           * Do NOT use a fake rate.
           *
           * NaN tells formatPrice() that the requested
           * currency could not currently be converted.
           */
          setExchangeRate(
            Number.NaN
          );
        } finally {
          setExchangeRateLoading(
            false
          );
        }
      },
      []
    );

  // =======================================================
  // COUNTRY CHANGE
  // =======================================================

  function setCountry(
    newCountry:
      CountryCode
  ) {
    setCountryState(
      newCountry
    );

    const selectedCountry =
      getCountryByCode(
        newCountry
      );

    if (
      selectedCountry
    ) {
      setCurrencyState(
        selectedCountry.currency
      );
    }
  }

  // =======================================================
  // MANUAL CURRENCY CHANGE
  // =======================================================

  function setCurrency(
    newCurrency:
      CurrencyCode
  ) {
    setCurrencyState(
      newCurrency
    );
  }

  // =======================================================
  // LOAD RATE WHEN CURRENCY CHANGES
  // =======================================================

  useEffect(() => {
    void fetchExchangeRate(
      currency
    );
  }, [
    currency,
    fetchExchangeRate,
  ]);

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  const value =
    useMemo(
      () => ({
        country,

        currency,

        setCountry,

        setCurrency,

        exchangeRateLoading,

        formatPrice(
          amountInLkr:
            number
        ) {
          // Base currency
          if (
            currency ===
            BASE_CURRENCY
          ) {
            const formatted =
              new Intl.NumberFormat(
                "en-US",
                {
                  maximumFractionDigits:
                    0,
                }
              ).format(
                amountInLkr
              );

            return `LKR ${formatted}`;
          }

          // Waiting for live rate
          if (
            exchangeRateLoading
          ) {
            return `${currency} ...`;
          }

          // API failed or currency unsupported
          if (
            !Number.isFinite(
              exchangeRate
            )
          ) {
            return `${currency} unavailable`;
          }

          const converted =
            amountInLkr *
            exchangeRate;

          // Let Intl determine appropriate decimal
          // formatting for the selected ISO currency.
          let maximumFractionDigits =
            2;

          try {
            maximumFractionDigits =
            new Intl.NumberFormat(
                "en-US",
                {
                style:
                    "currency",

                currency,
                }
            ).resolvedOptions()
                .maximumFractionDigits ??
            2;
          } catch {
            maximumFractionDigits =
              2;
          }

          const formattedAmount =
            new Intl.NumberFormat(
              "en-US",
              {
                minimumFractionDigits:
                  maximumFractionDigits,

                maximumFractionDigits:
                  maximumFractionDigits,
              }
            ).format(
              converted
            );

          return `${currency} ${formattedAmount}`;
        },
      }),
      [
        country,
        currency,
        exchangeRate,
        exchangeRateLoading,
      ]
    );

  return (
    <RegionContext.Provider
      value={
        value
      }
    >
      {children}
    </RegionContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useRegion() {
  const context =
    useContext(
      RegionContext
    );

  if (
    !context
  ) {
    throw new Error(
      "useRegion must be used inside RegionProvider"
    );
  }

  return context;
}