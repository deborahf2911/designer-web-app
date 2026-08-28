import {
  Link,
} from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 py-16 text-white">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-center lg:flex-row lg:text-left">

        <div>

          <h2 className="text-4xl font-black lg:text-5xl">
            Ready To Create Something Amazing?
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Create unique custom products with our
            online designer and bring your ideas to life.
          </p>

        </div>

        <Link
          to="/customize"
          className="shrink-0 rounded-xl bg-white px-10 py-5 text-lg font-bold text-blue-700 transition hover:scale-105 hover:bg-blue-50"
        >
          Start Designing
        </Link>

      </div>

    </section>
  );
}