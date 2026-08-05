import * as z from "zod";

export const SignupFormSchema = z.object({
  email: z.email({ error: "Enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "At least 8 characters." })
    .regex(/[a-zA-Z]/, { error: "At least one letter." })
    .regex(/[0-9]/, { error: "At least one number." })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.email({ error: "Enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }).trim(),
});

export type AuthFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
