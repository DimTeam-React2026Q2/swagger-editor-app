import { createNavigation } from "next-intl/navigation";

const locales = ["en", "ru"] as const;
const defaultLocale = "en" as const;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({ locales, defaultLocale });
