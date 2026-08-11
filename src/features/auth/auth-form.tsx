"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AuthFormState } from "@/lib/definitions";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
};

const copy = {
  login: {
    title: "Welcome back",
    description: "Sign in to your PixelVault library.",
    submit: "Sign In",
    switchLabel: "Don't have an account?",
    switchHref: "/signup",
    switchLinkText: "Sign up",
  },
  signup: {
    title: "Create your account",
    description: "Start organizing your screenshots.",
    submit: "Sign Up",
    switchLabel: "Already have an account?",
    switchHref: "/login",
    switchLinkText: "Sign in",
  },
};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const text = copy[mode];

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!state?.errors?.email}
              aria-describedby={state?.errors?.email ? "email-error" : undefined}
              required
            />
            {state?.errors?.email && (
              <p id="email-error" className="text-[12px] text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              aria-invalid={!!state?.errors?.password}
              aria-describedby={state?.errors?.password ? "password-error" : undefined}
              required
            />
            {state?.errors?.password && (
              <div id="password-error" className="text-[12px] text-destructive">
                {state.errors.password.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </div>

          {state?.message && (
            <p role="alert" className="text-[13px] text-destructive">
              {state.message}
            </p>
          )}

          <Button disabled={pending} type="submit" className="mt-1 w-full">
            {pending ? "Please wait..." : text.submit}
          </Button>
        </form>

        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          {text.switchLabel}{" "}
          <Link href={text.switchHref} className="font-medium text-foreground hover:underline">
            {text.switchLinkText}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
