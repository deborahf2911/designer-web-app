import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import heroImage from "../../assets/images/kingdom-threads-hero.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

      {/* BACKGROUND EFFECTS */}

      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col items-center justify-between gap-12 px-6 py-16 lg:flex-row lg:py-20">

        {/* =====================================
            LEFT
        ===================================== */}

        <div className="max-w-xl">

          <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
            NEW COLLECTION 2026
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight lg:text-7xl">
            Design.
            <br />
            Create.
            <br />
            Make It Yours.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Create unique custom products with our
            professional online designer. Upload your
            artwork, add text, change colours and preview
            your creation before placing your order.
          </p>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/customize"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700"
            >
              Start Designing

              <ArrowRight
                size={18}
              />
            </Link>

            <Link
              to="/shop"
              className="rounded-xl border border-white/30 px-8 py-4 font-semibold transition hover:bg-white hover:text-black"
            >
              Explore Shop
            </Link>

          </div>

          {/* FEATURES */}

          <div className="mt-9 space-y-3">

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={21}
                className="text-green-400"
              />

              <span>
                Premium Printing Quality
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={21}
                className="text-green-400"
              />

              <span>
                Powerful Design Tools
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={21}
                className="text-green-400"
              />

              <span>
                Island-wide Delivery
              </span>
            </div>

          </div>

        </div>

        {/* =====================================
            RIGHT
        ===================================== */}

        <div className="relative flex w-full max-w-xl items-center justify-center">

          <img
            src={heroImage}
            alt="Kingdom Threads custom products"
            className="relative z-10 w-full object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.45)]"
          />

        </div>

      </div>

    </section>
  );
}