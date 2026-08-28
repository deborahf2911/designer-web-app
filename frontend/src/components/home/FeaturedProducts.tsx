import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import {
  shopProducts,
} from "../../data/shopProducts";

export default function FeaturedProducts() {
  const featuredProducts =
    shopProducts.slice(0, 4);

  return (
    <section className="bg-slate-50 py-20">

      <div className="mx-auto max-w-7xl px-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-10 flex items-end justify-between">

          <div>

            <p className="font-semibold uppercase tracking-[0.3em] text-blue-600">
              FEATURED PRODUCTS
            </p>

            <h2 className="mt-3 text-4xl font-black lg:text-5xl">
              Shop Ready-Made Designs
            </h2>

            <p className="mt-3 max-w-xl text-gray-500">
              Discover our latest ready-to-order
              products.
            </p>

          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700 lg:flex"
          >
            View All

            <ArrowRight
              size={18}
            />
          </Link>

        </div>

        {/* =====================================
            PRODUCTS
        ===================================== */}

        {featuredProducts.length === 0 ? (

          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center">

            <h3 className="text-xl font-bold">
              Ready-made collection coming soon
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              Our finished designs and
              ready-to-order products will
              appear here.
            </p>

            <Link
              to="/customize"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Your Own

              <ArrowRight
                size={18}
              />
            </Link>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {featuredProducts.map(
              (product) => (

                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <Link
                    to={`/shop/${product.id}`}
                    className="block"
                  >

                    <div className="relative">

                      {product.badge && (
                        <span className="absolute left-5 top-5 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                          {product.badge}
                        </span>
                      )}

                      <div className="h-80 overflow-hidden bg-gray-100">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        />

                      </div>

                    </div>

                  </Link>

                  {/* DETAILS */}

                  <div className="p-6">

                    <Link
                      to={`/shop/${product.id}`}
                      className="transition hover:text-blue-600"
                    >
                      <h3 className="text-xl font-bold">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4">

                      <span className="text-2xl font-black">
                        Rs.{" "}
                        {product.price.toLocaleString()}
                      </span>

                      <Link
                        to={`/shop/${product.id}`}
                        className="shrink-0 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        View Product
                      </Link>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

        {/* MOBILE VIEW ALL */}

        {featuredProducts.length > 0 && (
          <div className="mt-8 lg:hidden">

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-semibold text-blue-600"
            >
              View All

              <ArrowRight
                size={18}
              />
            </Link>

          </div>
        )}

      </div>

    </section>
  );
}