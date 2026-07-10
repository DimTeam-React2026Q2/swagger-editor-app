"use client";

import { useTransition, type ReactElement } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = ["en", "ru"] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Switches the active locale while staying on the current route.
 * next-intl's router rewrites the path with the new locale prefix.
 */
export default function LanguageToggle(): ReactElement {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (locale: Locale): void => {
    if (locale === activeLocale) return;
    startTransition((): void => {
      router.replace(pathname, { locale });
    });
  };

  return (
    <div
      className="flex items-center overflow-hidden rounded border border-white/25"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map(
        (locale): ReactElement => (
          <button
            key={locale}
            type="button"
            onClick={(): void => switchTo(locale)}
            disabled={isPending}
            aria-pressed={locale === activeLocale}
            className={`px-2 py-0.5 text-xs font-semibold uppercase transition-colors ${
              locale === activeLocale
                ? "bg-white text-[#173647]"
                : "bg-transparent text-white/80 hover:bg-white/10"
            }`}
          >
            {locale}
          </button>
        )
      )}
    </div>
  );
}
