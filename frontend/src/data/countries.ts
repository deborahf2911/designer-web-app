import {
  countries,
  getEmojiFlag,
  type TCountryCode,
} from "countries-list";

export type CountryCode =
  TCountryCode;

export type CurrencyCode =
  string;

export interface CountryOption {
  code: CountryCode;
  name: string;
  currency: CurrencyCode;
  flag: string;
}

export const countryOptions:
  CountryOption[] =
  (
    Object.entries(
      countries
    ) as [
      CountryCode,
      (typeof countries)[CountryCode],
    ][]
  )
    .map(
      ([
        code,
        country,
      ]) => ({
        code,

        name:
          country.name,

        currency:
          country.currency[
            0
          ] ??
          "USD",

        flag:
          getEmojiFlag(
            code
          ),
      })
    )
    .sort(
      (
        first,
        second
      ) =>
        first.name.localeCompare(
          second.name
        )
    );

export function getCountryByCode(
  code:
    CountryCode
) {
  return (
    countryOptions.find(
      (
        country
      ) =>
        country.code ===
        code
    ) ??
    null
  );
}