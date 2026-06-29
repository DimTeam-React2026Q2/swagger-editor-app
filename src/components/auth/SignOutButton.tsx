"use client";

import { useTransition, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";

export default function SignOutButton(): ReactElement {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      type="button"
      disabled={isPending}
      onClick={(): void => startTransition((): void => void signOutAction())}
    >
      Sign out
    </Button>
  );
}
