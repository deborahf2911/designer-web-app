import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const {
    signIn,
    signInWithGoogle,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================================
  // EMAIL LOGIN
  // =========================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signIn(
        email.trim(),
        password
      );

      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();

      // No navigate() here.
      // Supabase redirects to Google.
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to sign in with Google."
        );
      }

      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-6 py-12">

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* TITLE */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to your Kingdom Threads
            account
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* EMAIL FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* SIGN IN */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* DIVIDER */}

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs font-medium uppercase text-gray-400">
            Or
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* GOOGLE */}

        <button
          type="button"
          onClick={() =>
            void handleGoogleLogin()
          }
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.38Z"
            />

            <path
              fill="#34A853"
              d="M12 22c2.7 0 4.98-.9 6.64-2.39l-3.24-2.51c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.59A10 10 0 0 0 12 22Z"
            />

            <path
              fill="#FBBC05"
              d="M6.39 13.93A6 6 0 0 1 6.07 12c0-.67.11-1.32.32-1.93V7.48H3.05A10 10 0 0 0 2 12c0 1.61.39 3.13 1.05 4.52l3.34-2.59Z"
            />

            <path
              fill="#EA4335"
              d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.97 2.96 14.7 2 12 2a10 10 0 0 0-8.95 5.48l3.34 2.59C7.18 7.7 9.39 5.94 12 5.94Z"
            />
          </svg>

          Continue with Google
        </button>

        {/* REGISTER */}

        <p className="mt-7 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create account
          </Link>
        </p>

      </div>

    </div>
  );
}