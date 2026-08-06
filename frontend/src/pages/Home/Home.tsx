import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">

      <h1 className="mb-6 text-5xl font-bold">
        Custom T-Shirts
      </h1>

      <p className="mb-10 text-lg text-gray-600">
        Design your own premium T-shirt.
      </p>

      <Link
        to="/shop"
        className="rounded-lg bg-blue-600 px-8 py-4 text-white"
      >
        Shop Now
      </Link>

    </div>
  );
}