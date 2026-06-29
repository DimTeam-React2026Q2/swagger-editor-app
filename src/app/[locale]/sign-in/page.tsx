import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { signInAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

export default async function SignInPage(): Promise<ReactElement> {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16">
      <AuthForm mode="sign-in" action={signInAction} />
    </main>
  );
}
