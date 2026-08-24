import {
  Link,
} from "react-router-dom";

import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import {
  useAuth,
} from "../../contexts/AuthContext";

export default function Footer() {
  const {
    user,
  } = useAuth();

  return (
    <footer className="bg-slate-950 text-gray-300">

      {/* =====================================
          MAIN FOOTER
      ===================================== */}

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* =====================================
            COMPANY
        ===================================== */}

        <div>

          <h2 className="text-2xl font-black text-white">
            Kingdom Threads
          </h2>

          <p className="mt-5 max-w-sm leading-7 text-slate-400">
            Create unique custom products using our
            professional online designer. Design,
            personalize and order in minutes.
          </p>

          {/* SOCIAL */}

          <div className="mt-7 flex gap-4">

            <a
              href="#"
              aria-label="Facebook"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-pink-600"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-500"
            >
              <FaLinkedinIn size={18} />
            </a>

          </div>

        </div>

        {/* =====================================
            SHOP
        ===================================== */}

        <div>

          <h3 className="text-lg font-bold text-white">
            Shop
          </h3>

          <ul className="mt-5 space-y-3 text-slate-400">

            <li>
              <Link
                to="/shop"
                className="transition hover:text-white"
              >
                T-Shirts
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="transition hover:text-white"
              >
                Hoodies
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="transition hover:text-white"
              >
                Caps
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="transition hover:text-white"
              >
                Mugs
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="transition hover:text-white"
              >
                Accessories
              </Link>
            </li>

          </ul>

        </div>

        {/* =====================================
            QUICK LINKS
        ===================================== */}

        <div>

          <h3 className="text-lg font-bold text-white">
            Quick Links
          </h3>

          <ul className="mt-5 space-y-3 text-slate-400">

            <li>
              <Link
                to="/"
                className="transition hover:text-white"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="transition hover:text-white"
              >
                Shop
              </Link>
            </li>

            {/* LOGGED IN */}

            {user ? (
              <>
                <li>
                  <Link
                    to="/account"
                    className="transition hover:text-white"
                  >
                    My Account
                  </Link>
                </li>

                <li>
                  <Link
                    to="/orders"
                    className="transition hover:text-white"
                  >
                    My Orders
                  </Link>
                </li>

                <li>
                  <Link
                    to="/saved-designs"
                    className="transition hover:text-white"
                  >
                    Saved Designs
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* LOGGED OUT */}

                <li>
                  <Link
                    to="/login"
                    className="transition hover:text-white"
                  >
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="transition hover:text-white"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>

        </div>

        {/* =====================================
            CONTACT
        ===================================== */}

        <div>

          <h3 className="text-lg font-bold text-white">
            Contact
          </h3>

          <div className="mt-5 space-y-4 text-slate-400">

            <div className="flex items-start gap-3">

              <MapPin
                size={21}
                className="mt-0.5 shrink-0 text-blue-500"
              />

              <span>
                Colombo, Sri Lanka
              </span>

            </div>

            <div className="flex items-start gap-3">

              <Phone
                size={21}
                className="mt-0.5 shrink-0 text-blue-500"
              />

              <span>
                +94 77 123 4567
              </span>

            </div>

            <div className="flex items-start gap-3">

              <Mail
                size={21}
                className="mt-0.5 shrink-0 text-blue-500"
              />

              <span className="break-all">
                info@kingdomthreads.com
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          BOTTOM
      ===================================== */}

      <div className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row">

          <p>
            © 2026 Kingdom Threads. All Rights Reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6">

            <Link
              to="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              to="/cookies"
              className="transition hover:text-white"
            >
              Cookies
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}