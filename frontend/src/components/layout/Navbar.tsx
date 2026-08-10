import { Link } from "react-router-dom";
import { ShoppingCart, Search, User } from "lucide-react";
import logo from "../../assets/images/kingdom-threads-logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
        to="/"
        className="flex items-center gap-3"
        >
        <img
            src={logo}
            alt="Artifex Studio"
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

        {/* Navigation */}
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

        {/* Right */}
        <div className="flex items-center gap-5">

          <button className="transition hover:text-blue-600">
            <Search size={21} />
        </button>

        <Link
            to="/cart"
            className="relative transition hover:text-blue-600"
        >
            <ShoppingCart size={22} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                0
            </span>
        </Link>

        <button className="transition hover:text-blue-600">
            <User size={22} />
        </button>

        </div>

      </div>
    </header>
  );
}