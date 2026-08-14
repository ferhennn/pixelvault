import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/auth-form";
import { signup } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return <AuthForm mode="signup" action={signup} />;
}
