import type { ReactElement } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({
  message,
  className = "",
}: ErrorMessageProps): ReactElement {
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 ${className}`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
      <span className="break-words">{message}</span>
    </div>
  );
}
