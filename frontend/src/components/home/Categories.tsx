import { Link } from "react-router-dom";

import tshirt from "../../assets/images/categories/tshirt.jpg";
import hoodie from "../../assets/images/categories/hoodie.jpg";
import cap from "../../assets/images/categories/cap.jpg";
import mug from "../../assets/images/categories/mug.jpg";

const categories = [
  {
    title: "T-Shirts",
    image: tshirt,
    link: "/customize/tshirts",
  },
  {
    title: "Hoodies",
    image: hoodie,
    link: "/customize/hoodies",
  },
  {
    title: "Caps",
    image: cap,
    link: "/customize/caps",
  },
  {
    title: "Mugs",
    image: mug,
    link: "/customize/mugs",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">

      <div className="mb-14 text-center">

        <h2 className="text-4xl font-bold">
          Customize Anything
        </h2>

        <p className="mt-3 text-gray-500">
          Choose your favorite product and make it uniquely yours.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {categories.map(
          (category) => (

            <Link
              key={
                category.title
              }
              to={
                category.link
              }
              className="group overflow-hidden rounded-3xl bg-white shadow transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="h-72 overflow-hidden bg-gray-100">

                <img
                  src={
                    category.image
                  }
                  alt={
                    category.title
                  }
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

              </div>

              <div className="p-6">

                <h3 className="text-xl font-semibold">
                  {
                    category.title
                  }
                </h3>

              </div>

            </Link>

          )
        )}

      </div>

    </section>
  );
}