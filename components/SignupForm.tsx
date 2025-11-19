"use client";

import Link from "next/link";
import FormInput from "./FormInput";
import GoogleButton from "./GoogleButton";
import { useSignupForm } from "@/hooks/useSignupForm";

export default function SignupForm() {
  const { formData, errors, loading, handleChange, handleSubmit } =
    useSignupForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold text-text-default">
            Create your{" "}
            <Link
              href={"/"}
              className="font-molgan text-default hover:text-hover transition-colors duration-200"
            >
              WorkHub
            </Link>{" "}
            account
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-default hover:text-light transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          <div className="rounded-md space-y-4">
            <FormInput
              id="name"
              name="name"
              type="text"
              label="Full Name"
              placeholder="Theo Kortsos"
              required
              value={formData.name}
              error={errors.name}
              onChange={handleChange}
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
            />

            <FormInput
              id="businessName"
              name="businessName"
              type="text"
              label="Business Name (Optional)"
              placeholder="Your Business Name"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-2 px-4 border-2 border-success bg-background font-medium rounded-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed before:content-[''] before:absolute before:inset-0 before:bg-success before:transition-all before:duration-300 before:ease-out before:scale-x-100 hover:before:scale-x-0 cursor-pointer"
            >
              <span className="relative z-10 transition-colors duration-300 text-white group-hover:text-success">
                {loading ? "Creating account..." : "Sign up"}
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
            <GoogleButton mode="signup" />
          </div>
        </form>
      </div>
    </div>
  );
}
