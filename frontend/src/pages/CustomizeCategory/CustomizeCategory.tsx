import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
} from "lucide-react";

import {
  products,
} from "../../data/products";

import type {
  ProductType,
} from "../../types/product";

// =========================================================
// CATEGORY CONFIG
// =========================================================

interface CategoryConfig {
  title: string;

  description: string;

  productTypes: ProductType[];
}

const categoryConfig:
  Record<
    string,
    CategoryConfig
  > = {
    tshirts: {
      title:
        "Custom T-Shirts",

      description:
        "Choose a T-shirt and create your own custom design.",

      productTypes: [
        "tshirt",
        "polo",
      ],
    },

    hoodies: {
      title:
        "Custom Hoodies",

      description:
        "Choose a hoodie and personalize it with your own artwork and text.",

      productTypes: [
        "hoodie",
      ],
    },

    caps: {
      title:
        "Custom Caps",

      description:
        "Choose a cap and create a personalized design.",

      productTypes: [
        "cap",
      ],
    },

    mugs: {
      title:
        "Custom Mugs",

      description:
        "Choose a mug and personalize it with your own design.",

      productTypes: [
        "mug",
      ],
    },
  };

// =========================================================
// PAGE
// =========================================================

export default function CustomizeCategory() {
  const {
    category,
  } =
    useParams();

  const navigate =
    useNavigate();

  const config =
    category
      ? categoryConfig[
          category
        ]
      : undefined;

  // =======================================================
  // INVALID CATEGORY
  // =======================================================

  if (
    !config
  ) {
    return (
      <main className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-4xl px-6 py-20 text-center">

          <h1 className="text-3xl font-bold">
            Category not found
          </h1>

          <p className="mt-3 text-gray-500">
            This customization category is not available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/customize"
              )
            }
            className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Browse Custom Products
          </button>

        </div>

      </main>
    );
  }

  // =======================================================
  // PRODUCTS
  // =======================================================

  const categoryProducts =
  products.filter(
    (
      product
    ) =>
      config.productTypes.includes(
        product.type
      )
  );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* =====================================
            BACK
        ===================================== */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customize"
            )
          }
          className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
        >
          <ArrowLeft
            size={
              18
            }
          />

          All Custom Products
        </button>

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mt-10">

          <p className="font-semibold uppercase tracking-[0.2em] text-blue-600">
            Customize
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            {
              config.title
            }
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            {
              config.description
            }
          </p>

        </div>

        {/* =====================================
            PRODUCT GRID
        ===================================== */}

        {categoryProducts.length >
        0 ? (

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {categoryProducts.map(
              (
                product
              ) => (

                <Link
                  key={
                    product.id
                  }
                  to={`/product/${product.id}`}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <div className="flex aspect-square items-center justify-center overflow-hidden bg-gray-100 p-6">

                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />

                  </div>

                  {/* DETAILS */}

                  <div className="p-6">

                    <h2 className="text-xl font-bold">
                      {
                        product.name
                      }
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {
                        product.description
                      }
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4">

                      {/* <p className="text-lg font-black">
                        Rs.{" "}
                        {product.price.toLocaleString()}
                      </p> */}

                      <span className="text-sm font-semibold text-blue-600">
                        Customize
                      </span>

                    </div>

                  </div>

                </Link>

              )
            )}

          </div>

        ) : (

          /* =====================================
              EMPTY CATEGORY
          ===================================== */

          <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">

            <h2 className="text-2xl font-bold">
              Coming Soon
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Customizable{" "}
              {
                config.title
                  .replace(
                    "Custom ",
                    ""
                  )
                  .toLowerCase()
              }{" "}
              will be available soon.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/customize"
                )
              }
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              View Other Products
            </button>

          </div>

        )}

      </div>

    </main>
  );
}