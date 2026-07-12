"use client";

import { useState, type ReactElement } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  value: string;
  label?: string;
}

export default function CopyButton({
  value,
  label = "Copy",
}: CopyButtonProps): ReactElement {
  const t = useTranslations("TryItOut");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout((): void => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 active:scale-95"
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-600" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  );
}
