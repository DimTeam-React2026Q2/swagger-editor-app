import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { signUpAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

export default async function SignUpPage(): Promise<ReactElement> {
  // Already logged in -> no reason to be here.
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16">
      <AuthForm mode="sign-up" action={signUpAction} />
    </main>
  );
}
