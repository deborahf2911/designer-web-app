import {
  useNavigate,
} from "react-router-dom";

import {
  products,
} from "../../data/products";

export default function Customize() {
  const navigate =
    useNavigate();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Customize Your Product
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Choose a product and create your
            own personalized design.
          </p>
        </div>

        {/* PRODUCTS */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {products
            .filter(
              (product) =>
                product.customizable
            )
            .map(
              (product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* IMAGE */}

                  <div className="flex h-80 items-center justify-center bg-gray-100 p-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* DETAILS */}

                  <div className="p-5">

                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                      {getCategoryLabel(
                        product.type
                      )}
                    </p>

                    <h2 className="text-xl font-bold">
                      {product.name}
                    </h2>

                    <p className="mt-2 min-h-12 text-sm text-gray-600">
                      {
                        product.description
                      }
                    </p>

                    {/* <p className="mt-4 text-lg font-bold">
                      Rs.{" "}
                      {product.price.toLocaleString()}
                    </p> */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/product/${product.id}`
                        )
                      }
                      className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Customize
                    </button>

                  </div>

                </article>
              )
            )}

        </div>

      </div>
    </main>
  );
}

function getCategoryLabel(
  type: string
) {
  switch (type) {
    case "tshirt":
      return "T-Shirt";

    case "hoodie":
      return "Hoodie";

    case "polo":
      return "Polo Shirt";

    case "mug":
      return "Mug";

    case "cap":
      return "Cap";

    case "tote":
      return "Tote Bag";

    default:
      return "Product";
  }
}