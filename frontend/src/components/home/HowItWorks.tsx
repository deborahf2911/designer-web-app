import {
  ShoppingBag,
  Palette,
  Eye,
  Truck,
} from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    title: "Choose a Product",
    description:
      "Browse our collection of premium apparel and accessories.",
  },
  {
    icon: Palette,
    title: "Customize",
    description:
      "Upload images, add text, choose colors and personalize every detail.",
  },
  {
    icon: Eye,
    title: "Preview",
    description:
      "See your design from every angle before placing your order.",
  },
  {
    icon: Truck,
    title: "Delivered",
    description:
      "We print, pack and deliver your custom product right to your door.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-blue-600">
            HOW IT WORKS
          </p>

          <h2 className="mt-4 text-5xl font-black">
            Design in Four Easy Steps
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Creating personalized products has never been easier.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-3xl bg-slate-50 p-10 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <span className="absolute right-8 top-8 text-6xl font-black text-slate-100">
                  0{index + 1}
                </span>

                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                  <Icon size={36} />
                </div>

                <h3 className="text-2xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-5 leading-7 text-gray-500">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}