import {
  Palette,
  Eye,
  PackageCheck,
} from "lucide-react";

const benefits = [
  {
    title: "Easy Customization",
    description:
      "Upload artwork, add text, change colours and build your design using simple customization tools.",
    icon: Palette,
  },
  {
    title: "Preview Before Ordering",
    description:
      "See your customized product before adding it to your cart and placing an order.",
    icon: Eye,
  },
  {
    title: "Made For You",
    description:
      "Your selected product and customization details are prepared specifically for your order.",
    icon: PackageCheck,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-blue-600">
            WHY KINGDOM THREADS
          </p>

          <h2 className="mt-4 text-4xl font-black lg:text-5xl">
            Create It Your Way
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            A simple way to create personalized products
            exactly how you want them.
          </p>

        </div>

        {/* =====================================
            CARDS
        ===================================== */}

        <div className="mt-12 grid gap-8 lg:grid-cols-3">

          {benefits.map((benefit) => {
            const Icon =
              benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-3xl border border-gray-100 bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {benefit.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}