import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { products } from "../../data/products";

export default function Product() {
  const { productId } = useParams();

  const navigate = useNavigate();

  const product =
    products.find((p) => p.id === Number(productId));

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        Product not found
      </div>
    );
  }

  const [selectedColor, setSelectedColor] =
  useState(product.colors[0]);

  const [selectedSize, setSelectedSize] =
    useState(product.sizes[1]);

  const [quantity, setQuantity] =
    useState(1);

  return (
    <div className="mx-auto max-w-7xl p-10">

      <div className="grid gap-12 lg:grid-cols-2">

        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl border bg-gray-100"
          />
        </div>

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-4 text-gray-600">
            {product.description}
          </p>

          <div className="mt-8">
            <span className="text-3xl font-bold">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          <div className="mt-8">
            <p className="mb-3 font-semibold">
              Color
            </p>

            <div className="flex gap-3">

              {product.colors.map((color) => (

                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 w-10 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  style={{
                    backgroundColor: color,
                  }}
                />

              ))}

            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 font-semibold">
              Size
            </p>

            <div className="flex gap-3">

              {product.sizes.map((size) => (

                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-4 py-2 ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {size}
                </button>

              ))}

            </div>
          </div>

          <div className="mt-8">

            <p className="mb-3 font-semibold">
              Quantity
            </p>

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                className="rounded border px-3 py-2"
              >
                -
              </button>

              <span className="text-xl">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                className="rounded border px-3 py-2"
              >
                +
              </button>

            </div>

          </div>

          <div className="mt-10 flex gap-4">

            <button
              onClick={() =>
                navigate(
                  `/designer/${product.id}`,
                  {
                    state: {
                      color: selectedColor,
                      size: selectedSize,
                      quantity
                    },
                  }
                )
              }
              className="rounded-lg bg-black px-8 py-3 text-white hover:bg-gray-800"
            >
              Customize
            </button>

            <button
              className="rounded-lg border px-8 py-3 hover:bg-gray-100"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}