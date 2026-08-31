import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const {
    signUp,
    signInWithGoogle,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================================
  // EMAIL REGISTRATION
  // =========================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    setLoading(true);

    try {
      await signUp(
        name.trim(),
        email.trim(),
        password
      );

      setMessage(
        "Account created. Please check your email to confirm your account."
      );

      /*
       * We'll store `name` in the user's
       * profile in the next step.
       *
       * Don't navigate immediately because
       * Supabase may require email
       * confirmation.
       */

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // GOOGLE REGISTRATION
  // =========================================

  async function handleGoogleSignUp() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await signInWithGoogle();

      // Supabase redirects to Google.
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to continue with Google."
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
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your Kingdom Threads
            account
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your full name"
              autoComplete="name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

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
              placeholder="Create a password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* CREATE ACCOUNT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
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
            void handleGoogleSignUp()
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

        {/* LOGIN */}

        <p className="mt-7 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>

      </div>

    </div>
  );
}