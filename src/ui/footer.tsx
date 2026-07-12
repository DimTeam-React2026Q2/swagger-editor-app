"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function Footer(): React.JSX.Element {
  const t = useTranslations("Header");

  return (
    <footer className="flex items-center justify-center bg-[#173647] p-5 text-white">
      <Button variant="ghost" asChild>
        <Link href="/about">{t("about")}</Link>
      </Button>
    </footer>
  );
}
