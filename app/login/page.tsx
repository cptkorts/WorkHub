import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  // Server-side session check
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/analytics"); // Server redirect: instant, no client JS needed
  }

  // Show loading while checking session
  if (session === "loading") {
    return <LoadingSpinner />;
  }

  return <LoginForm />;
}
