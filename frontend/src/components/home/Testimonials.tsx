import { Star } from "lucide-react";

const testimonials = [
  {
    name: "John Perera",
    role: "Business Owner",
    image: "https://i.pravatar.cc/150?img=12",
    review:
      "Excellent print quality and an incredibly easy designer. Our company shirts looked fantastic.",
  },
  {
    name: "Amanda Silva",
    role: "Fashion Designer",
    image: "https://i.pravatar.cc/150?img=32",
    review:
      "The live preview is amazing. I knew exactly what I was ordering before checkout.",
  },
  {
    name: "Michael Fernando",
    role: "University Student",
    image: "https://i.pravatar.cc/150?img=15",
    review:
      "I designed hoodies for our batch and everyone loved them. Delivery was faster than expected.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-blue-600">
            CUSTOMER REVIEWS
          </p>

          <h2 className="mt-4 text-5xl font-black">
            Loved By Thousands
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            See why customers choose Artifex Studio for
            their custom apparel.
          </p>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {testimonials.map((person) => (

            <div
              key={person.name}
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="mb-6 flex">

                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="leading-8 text-gray-600">
                "{person.review}"
              </p>

              <div className="mt-8 flex items-center gap-4">

                <img
                  src={person.image}
                  alt={person.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>

                  <h4 className="font-bold">
                    {person.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {person.role}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}