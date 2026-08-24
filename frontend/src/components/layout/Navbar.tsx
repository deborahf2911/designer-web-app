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
  LogOut,
  Search,
  ShoppingCart,
  User,
  Package,
  Palette,
} from "lucide-react";

import logo from "../../assets/images/kingdom-threads-logo.png";

import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    signOut,
  } = useAuth();

  const [accountOpen, setAccountOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // =========================================
  // USER DISPLAY NAME
  // =========================================

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "";

  const firstName =
    fullName
      ? fullName.split(" ")[0]
      : user?.email?.split("@")[0] ??
        "Account";

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  // =========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setAccountOpen(false);
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

      setAccountOpen(false);

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

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Kingdom Threads"
            className="h-11 w-auto"
          />

          <div className="hidden sm:block">

            <h1 className="text-xl font-bold tracking-wide">
              Kingdom Threads
            </h1>

            <p className="-mt-1 text-xs text-gray-500">
              Design • Customize • Create
            </p>

          </div>
        </Link>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="hidden items-center gap-10 font-medium md:flex">

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
            to="/orders"
            className="transition hover:text-blue-600"
          >
            My Orders
          </Link>

        </nav>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="flex items-center gap-5">

          {/* SEARCH */}

          <button
            type="button"
            aria-label="Search"
            className="transition hover:text-blue-600"
          >
            <Search size={21} />
          </button>

          {/* CART */}

          <Link
            to="/cart"
            className="relative transition hover:text-blue-600"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              0
            </span>
          </Link>

          {/* =====================================
              AUTH AREA
          ===================================== */}

          {!loading && !user && (
            <Link
              to="/login"
              className="flex items-center gap-2 transition hover:text-blue-600"
            >
              <User size={22} />

              <span className="hidden text-sm font-medium lg:inline">
                Sign In
              </span>
            </Link>
          )}

          {!loading && user && (
            <div
              ref={dropdownRef}
              className="relative"
            >

              {/* USER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setAccountOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-100"
              >

                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={firstName}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <User size={19} />
                  </div>
                )}

                <span className="hidden max-w-32 truncate text-sm font-semibold lg:block">
                  {firstName}
                </span>

                <ChevronDown
                  size={15}
                  className={`hidden transition-transform lg:block ${
                    accountOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>

              {/* =====================================
                  DROPDOWN
              ===================================== */}

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                  {/* USER INFO */}

                  <div className="border-b border-gray-100 px-4 py-4">

                    <p className="font-semibold">
                      {fullName ||
                        firstName}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>

                  </div>

                  {/* MY ACCOUNT */}

                  <Link
                    to="/account"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                    className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                  >
                    <User size={18} />

                    My Account
                  </Link>

                  {/* ORDERS */}

                  <Link
                    to="/orders"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                    className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                  >
                    <Package size={18} />

                    My Orders
                  </Link>

                  {/* SAVED DESIGNS */}

                  <Link
                    to="/saved-designs"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                    className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                  >
                    <Palette size={18} />

                    Saved Designs
                  </Link>

                  {/* SIGN OUT */}

                  <div className="border-t border-gray-100">

                    <button
                      type="button"
                      onClick={() =>
                        void handleSignOut()
                      }
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />

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