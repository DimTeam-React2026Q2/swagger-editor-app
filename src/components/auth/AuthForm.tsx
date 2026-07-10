"use client";

import { useState, useTransition, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/lib/auth/validation";
import type { AuthState } from "@/lib/auth/actions";

type Mode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: Mode;
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
};

const COPY = {
  "sign-in": {
    title: "Sign in",
    submit: "Sign in",
    altText: "Need an account?",
    altHref: "/sign-up",
    altLink: "Sign up",
  },
  "sign-up": {
    title: "Create account",
    submit: "Sign up",
    altText: "Already have an account?",
    altHref: "/sign-in",
    altLink: "Sign in",
  },
} as const;

export default function AuthForm({
  mode,
  action,
}: AuthFormProps): ReactElement {
  const copy = COPY[mode];
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues | SignUpValues>({
    resolver: zodResolver(mode === "sign-in" ? signInSchema : signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit((values): void => {
    setServerError(null);
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    startTransition(async (): Promise<void> => {
      const result = await action({ error: null }, formData);
      if (result?.error) setServerError(result.error);
    });
  });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-semibold text-[#173647]">{copy.title}</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">Email</span>
          <input
            type="email"
            autoComplete="email"
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-[#173647]"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-xs text-red-600">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">Password</span>
          <input
            type="password"
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-[#173647]"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-xs text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>

        {serverError && <ErrorMessage message={serverError} />}

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Please wait..." : copy.submit}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        {copy.altText}{" "}
        <Link
          href={copy.altHref}
          className="font-medium text-[#173647] underline"
        >
          {copy.altLink}
        </Link>
      </p>
    </div>
  );
}
