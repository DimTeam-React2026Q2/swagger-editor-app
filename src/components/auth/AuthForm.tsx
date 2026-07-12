"use client";

import { useState, useTransition, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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

export default function AuthForm({
  mode,
  action,
}: AuthFormProps): ReactElement {
  const t = useTranslations("Auth");
  const isSignIn = mode === "sign-in";

  const title = isSignIn ? t("signIn") : t("createAccount");
  const submit = isSignIn ? t("signIn") : t("signUp");
  const altText = isSignIn ? t("needAccount") : t("haveAccount");
  const altHref = isSignIn ? "/sign-up" : "/sign-in";
  const altLink = isSignIn ? t("signUp") : t("signIn");

  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues | SignUpValues>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
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
      <h1 className="text-2xl font-semibold text-[#173647]">{title}</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">{t("email")}</span>
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
          <span className="font-medium text-zinc-700">{t("password")}</span>
          <input
            type="password"
            autoComplete={isSignIn ? "current-password" : "new-password"}
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
          {isPending ? t("pleaseWait") : submit}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        {altText}{" "}
        <Link href={altHref} className="font-medium text-[#173647] underline">
          {altLink}
        </Link>
      </p>
    </div>
  );
}
