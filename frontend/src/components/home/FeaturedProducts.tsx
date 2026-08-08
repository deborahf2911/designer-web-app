import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: "Rs. 2,490",
    image: "/src/assets/products/tshirt/white/front.png",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Premium Hoodie",
    price: "Rs. 5,990",
    image: "/src/assets/images/categories/hoodie.jpg",
    badge: "New",
  },
  {
    id: 3,
    name: "Snapback Cap",
    price: "Rs. 1,990",
    image: "/src/assets/images/categories/cap.jpg",
    badge: "Popular",
  },
  {
    id: 4,
    name: "Coffee Mug",
    price: "Rs. 1,290",
    image: "/src/assets/images/categories/mug.jpg",
    badge: "Trending",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-slate-50 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 flex items-end justify-between">

          <div>
            <p className="font-semibold uppercase tracking-[0.3em] text-blue-600">
              FEATURED PRODUCTS
            </p>

            <h2 className="mt-3 text-5xl font-black">
              Start Creating
            </h2>

            <p className="mt-4 max-w-xl text-gray-500">
              Choose your favorite product and customize
              it exactly the way you imagine.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 font-semibold text-blue-600 lg:flex"
          >
            View All
            <ArrowRight size={18} />
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {products.map((product) => (

            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="relative">

                <span className="absolute left-5 top-5 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  {product.badge}
                </span>

                <div className="h-80 bg-gray-100">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                  />

                </div>

              </div>

              <div className="p-6">

                <h3 className="text-xl font-bold">
                  {product.name}
                </h3>

                <p className="mt-2 text-gray-500">
                  Premium Quality
                </p>

                <div className="mt-6 flex items-center justify-between">

                  <span className="text-2xl font-black">
                    {product.price}
                  </span>

                  <span className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition group-hover:bg-blue-600">
                    Customize
                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}