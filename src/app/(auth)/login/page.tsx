import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/auth-form";
import { login } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return <AuthForm mode="login" action={login} />;
}
