"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/auth/SignOutButton";
import { Link } from "@/i18n/navigation";
import LanguageToggle from "@/components/i18n/LanguageToggle";
import { cn } from "@/lib/utils";

type HeaderProps = {
  isLoggedin: boolean;
};

export default function Header({ isLoggedin }: HeaderProps): React.JSX.Element {
  const t = useTranslations("Header");
  const [isSticky, setIsSticky] = useState(false);

  useEffect((): (() => void) => {
    const handleScroll = (): void => {
      setIsSticky(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 grid grid-cols-2 items-center p-5 text-white transition-colors duration-300",
        isSticky ? "bg-[#0f2530]" : "bg-[#173647]"
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/swagger-logo.svg"
          alt="Swagger logo"
          width={32}
          height={32}
          priority
        />
        Swagger
      </Link>
      <nav className="flex items-center justify-end gap-2">
        <LanguageToggle />
        <Button variant="ghost" asChild>
          <Link href="/about">{t("about")}</Link>
        </Button>
        {isLoggedin ? (
          <>
            <Button variant="ghost" asChild>
              <Link href="/history">{t("history")}</Link>
            </Button>
            <SignOutButton />
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">{t("signIn")}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/sign-up">{t("signUp")}</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
