"use client";

import Link from "next/link";
import FormInput from "./FormInput";
import GoogleButton from "./GoogleButton";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginForm() {
  const {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLoginForm();

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
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="Your email address"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
            <GoogleButton mode="signin" />
          </div>
        </form>
      </div>
    </div>
  );
}
