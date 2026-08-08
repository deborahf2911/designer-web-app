import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 text-center lg:flex-row lg:text-left">

        <div>

          <h2 className="text-5xl font-black">
            Ready To Create Something Amazing?
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-blue-100">
            Design premium custom apparel with our
            powerful online designer and bring your ideas
            to life.
          </p>

        </div>

        <Link
          to="/shop"
          className="rounded-xl bg-white px-10 py-5 text-lg font-bold text-blue-700 transition hover:scale-105"
        >
          Start Designing
        </Link>

      </div>
    </section>
  );
}