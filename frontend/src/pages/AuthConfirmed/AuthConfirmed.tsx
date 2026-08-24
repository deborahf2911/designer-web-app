import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function AuthConfirmed() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">

        <CheckCircle2
          size={56}
          className="mx-auto text-green-600"
        />

        <h1 className="mt-5 text-3xl font-bold">
          Email Confirmed
        </h1>

        <p className="mt-3 text-gray-500">
          Your Kingdom Threads account has been verified successfully.
        </p>

        <Link
          to="/login"
          className="mt-7 block w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Continue to Sign In
        </Link>

      </div>
    </div>
  );
}