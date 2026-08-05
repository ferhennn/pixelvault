import { AuthForm } from "@/features/auth/auth-form";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  return <AuthForm mode="signup" action={signup} />;
}
