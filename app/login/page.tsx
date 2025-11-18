"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

// Note: Client components can't export metadata directly.
// Metadata is set in the parent layout or via a wrapper server component.

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/analytics");
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/analytics");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/analytics" });
  };

  return (
    <div className="h-screen xl:min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold text-text-default">
            Sign in to{" "}
            <Link
              href="/"
              className="font-molgan text-default hover:text-hover transition-colors duration-200"
            >
              WorkHub
            </Link>
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Or{" "}
            <Link
              href="/signup"
              className="font-medium text-default hover:text-light transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-default"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-text-muted text-hover rounded-md focus:outline-none focus:ring-2 focus:ring-muted focus:border-muted sm:text-sm"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-default"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-text-muted text-hover rounded-md focus:outline-none focus:ring-2 focus:ring-muted focus:border-muted sm:text-sm"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-2 px-4 border-2 border-success text-success font-medium rounded-md overflow-hidden transition-colors duration-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed before:content-[''] before:absolute before:inset-0 before:bg-success before:transition-all before:duration-300 before:ease-out before:scale-x-0 hover:before:scale-x-100 cursor-pointer focus:ring-2 focus:ring-muted"
            >
              <span className="relative z-10">
                {loading ? "Signing in..." : "Sign in"}
              </span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-text-muted">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-border rounded-md shadow-sm bg-white text-sm font-medium text-default hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
