import {
  Link,
} from "react-router-dom";

import {
  shopProducts,
} from "../../data/shopProducts";

export default function Shop() {
  return (
    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}

        <div className="mb-10">

          <p className="font-semibold uppercase tracking-[0.3em] text-blue-600">
            READY-MADE COLLECTION
          </p>

          <h1 className="mt-3 text-4xl font-black lg:text-5xl">
            Shop Our Designs
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Browse ready-to-order products
            from the Kingdom Threads collection.
          </p>

        </div>

        {/* PRODUCTS */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {shopProducts.map(
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

                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Ready-Made
                  </p>

                  <Link
                    to={`/shop/${product.id}`}
                  >
                    <h2 className="mt-1 text-xl font-bold transition hover:text-blue-600">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-2 min-h-12 text-sm text-gray-500">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4">

                    <span className="text-xl font-black">
                      Rs.{" "}
                      {product.price.toLocaleString()}
                    </span>

                    <Link
                      to={`/shop/${product.id}`}
                      className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      View Product
                    </Link>

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      </div>

    </main>
  );
}