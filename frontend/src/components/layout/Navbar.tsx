import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ChevronDown,
  Globe2,
  LogOut,
  Search,
  ShoppingCart,
  User,
  Package,
  Palette,
} from "lucide-react";

import logo from "../../assets/images/kingdom-threads-logo.png";

import {
  useAuth,
} from "../../contexts/AuthContext";

import {
  useCart,
} from "../../contexts/CartContext";

import {
  useRegion,
} from "../../contexts/RegionContext";

import {
  countryOptions,
  getCountryByCode,
  type CountryCode,
} from "../../data/countries";

export default function Navbar() {
  const navigate =
    useNavigate();

  const {
    user,
    loading,
    signOut,
  } =
    useAuth();

  const {
    country,
    currency,
    setCountry,
  } =
    useRegion();

  const {
    cartCount,
  } =
    useCart();

  const [
    accountOpen,
    setAccountOpen,
  ] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(
      null
    );

  // =========================================
  // SELECTED COUNTRY
  // =========================================

  const selectedCountry =
    getCountryByCode(
      country
    );

  const countryName =
    selectedCountry?.name ??
    country;

  // =========================================
  // USER DISPLAY NAME
  // =========================================

  const fullName =
    user?.user_metadata
      ?.full_name ||
    user?.user_metadata
      ?.name ||
    "";

  const firstName =
    fullName
      ? fullName.split(
          " "
        )[0]
      : user?.email?.split(
          "@"
        )[0] ??
        "Account";

  const avatarUrl =
    user?.user_metadata
      ?.avatar_url ||
    user?.user_metadata
      ?.picture ||
    null;

  // =========================================
  // CLOSE ACCOUNT DROPDOWN
  // =========================================

  useEffect(() => {
    function handleClickOutside(
      event:
        MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setAccountOpen(
          false
        );
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================
  // LOGOUT
  // =========================================

  async function handleSignOut() {
    try {
      await signOut();

      setAccountOpen(
        false
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Unable to sign out:",
        error
      );
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">

        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
        >
          <img
            src={logo}
            alt="Kingdom Threads"
            className="h-11 w-auto"
          />

          <div className="hidden sm:block">

            <h1 className="whitespace-nowrap text-xl font-bold tracking-wide">
              Kingdom Threads
            </h1>

            <p className="-mt-1 whitespace-nowrap text-xs text-gray-500">
              Design • Customize • Create
            </p>

          </div>
        </Link>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="hidden items-center gap-7 font-medium lg:flex">

          <Link
            to="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="transition hover:text-blue-600"
          >
            Shop
          </Link>

          <Link
            to="/customize"
            className="transition hover:text-blue-600"
          >
            Customize
          </Link>

          <Link
            to="/orders"
            className="whitespace-nowrap transition hover:text-blue-600"
          >
            My Orders
          </Link>

        </nav>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="flex shrink-0 items-center gap-4">

          {/* =====================================
              REGION - DESKTOP
          ===================================== */}

          <div className="relative hidden items-center rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 md:flex">

            <Globe2
              size={18}
              className="ml-3 shrink-0 text-gray-500"
            />

            <select
              value={
                country
              }
              onChange={(
                event
              ) =>
                setCountry(
                  event.target
                    .value as CountryCode
                )
              }
              aria-label="Select country"
              className="max-w-[170px] cursor-pointer appearance-none bg-transparent py-2.5 pl-2 pr-9 text-sm font-medium outline-none"
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

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-[58px] text-gray-400"
            />

            <div className="mr-3 border-l border-gray-200 pl-3 text-xs font-bold text-blue-600">
              {currency}
            </div>

          </div>

          {/* =====================================
              REGION - MOBILE
          ===================================== */}

          <div className="relative md:hidden">

            <Globe2
              size={21}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
            />

            <select
              value={
                country
              }
              onChange={(
                event
              ) =>
                setCountry(
                  event.target
                    .value as CountryCode
                )
              }
              aria-label="Select country"
              title={`${countryName} · ${currency}`}
              className="h-9 w-7 cursor-pointer appearance-none bg-transparent text-transparent outline-none"
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

          </div>

          {/* =====================================
              SEARCH
          ===================================== */}

          <button
            type="button"
            aria-label="Search"
            className="transition hover:text-blue-600"
          >
            <Search
              size={21}
            />
          </button>

          {/* =====================================
              CART
          ===================================== */}

          <Link
            to="/cart"
            className="relative transition hover:text-blue-600"
            aria-label="Cart"
          >
            <ShoppingCart
              size={22}
            />

            {cartCount >
              0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">

                {cartCount >
                99
                  ? "99+"
                  : cartCount}

              </span>
            )}
          </Link>

          {/* =====================================
              SIGN IN
          ===================================== */}

          {!loading &&
            !user && (
              <Link
                to="/login"
                className="flex items-center gap-2 transition hover:text-blue-600"
              >
                <User
                  size={22}
                />

                <span className="hidden whitespace-nowrap text-sm font-medium xl:inline">
                  Sign In
                </span>
              </Link>
            )}

          {/* =====================================
              ACCOUNT
          ===================================== */}

          {!loading &&
            user && (
              <div
                ref={
                  dropdownRef
                }
                className="relative"
              >

                <button
                  type="button"
                  onClick={() =>
                    setAccountOpen(
                      (
                        previous
                      ) =>
                        !previous
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-100"
                >

                  {avatarUrl ? (
                    <img
                      src={
                        avatarUrl
                      }
                      alt={
                        firstName
                      }
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">

                      <User
                        size={19}
                      />

                    </div>
                  )}

                  <span className="hidden max-w-28 truncate text-sm font-semibold xl:block">
                    {firstName}
                  </span>

                  <ChevronDown
                    size={15}
                    className={`hidden transition-transform xl:block ${
                      accountOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                    <div className="border-b border-gray-100 px-4 py-4">

                      <p className="font-semibold">
                        {fullName ||
                          firstName}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {user.email}
                      </p>

                    </div>

                    <Link
                      to="/account"
                      onClick={() =>
                        setAccountOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                    >
                      <User
                        size={18}
                      />

                      My Account
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() =>
                        setAccountOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                    >
                      <Package
                        size={18}
                      />

                      My Orders
                    </Link>

                    <Link
                      to="/saved-designs"
                      onClick={() =>
                        setAccountOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                    >
                      <Palette
                        size={18}
                      />

                      Saved Designs
                    </Link>

                    <div className="border-t border-gray-100">

                      <button
                        type="button"
                        onClick={() =>
                          void handleSignOut()
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut
                          size={18}
                        />

                        Sign Out
                      </button>

                    </div>

                  </div>
                )}

              </div>
            )}

        </div>

      </div>

    </header>
  );
}