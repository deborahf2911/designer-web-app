import { Link } from "react-router-dom";

import type { Product } from "../../types/product";

interface Props {
  product: Product;
}

export default function ProductCard({
  product,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow transition hover:shadow-lg">

      <img
        src={product.image}
        alt={product.name}
        className="h-72 w-full object-contain bg-gray-100"
      />

      <div className="space-y-3 p-5">
        <h2 className="text-xl font-bold">
          {product.name}
        </h2>

        <p className="text-sm text-gray-600">
          {product.description}
        </p>

        <p className="text-2xl font-bold text-blue-600">
          Rs. {product.price.toLocaleString()}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="block rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          Customize
        </Link>
      </div>

    </div>
  );
}