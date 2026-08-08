import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300">

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-4">

        {/* Company */}

        <div>

          <h2 className="text-3xl font-black text-white">
            Artifex Studio
          </h2>

          <p className="mt-6 leading-8 text-slate-400">
            Create premium custom apparel using our
            professional online designer. Design,
            personalize and order in minutes.
          </p>

          <div className="mt-8 flex gap-4">

            <a
              href="#"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
            >
              <FaFacebookF size={20} />
            </a>

            <a
              href="#"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-pink-600"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="#"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-500"
            >
              <FaLinkedinIn size={20} />
            </a>

          </div>

        </div>

        {/* Shop */}

        <div>

          <h3 className="text-xl font-bold text-white">
            Shop
          </h3>

          <ul className="mt-6 space-y-4">

            <li>T-Shirts</li>

            <li>Hoodies</li>

            <li>Caps</li>

            <li>Mugs</li>

            <li>Accessories</li>

          </ul>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-bold text-white">
            Quick Links
          </h3>

          <ul className="mt-6 space-y-4">

            <li>Home</li>

            <li>Shop</li>

            <li>My Orders</li>

            <li>Login</li>

            <li>Register</li>

          </ul>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-xl font-bold text-white">
            Contact
          </h3>

          <div className="mt-6 space-y-5">

            <div className="flex gap-3">

              <MapPin className="text-blue-500" />

              <span>Colombo, Sri Lanka</span>

            </div>

            <div className="flex gap-3">

              <Phone className="text-blue-500" />

              <span>+94 77 123 4567</span>

            </div>

            <div className="flex gap-3">

              <Mail className="text-blue-500" />

              <span>info@artifexstudio.com</span>

            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-sm text-slate-500 lg:flex-row">

          <p>
            © 2026 Artifex Studio. All Rights Reserved.
          </p>

          <div className="flex gap-6">

            <span>Privacy Policy</span>

            <span>Terms</span>

            <span>Cookies</span>

          </div>

        </div>

      </div>

    </footer>
  );
}