"use client";

import { useTransition, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";

export default function SignOutButton(): ReactElement {
  const t = useTranslations("Header");
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      type="button"
      disabled={isPending}
      onClick={(): void => startTransition((): void => void signOutAction())}
    >
      {t("signOut")}
    </Button>
  );
}
