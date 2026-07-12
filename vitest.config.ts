import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*"],
      exclude: [
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
        "src/test/**/*",
        // Type declarations — no executable code.
        "src/types/**/*",
        "**/*.d.ts",
        // Non-code assets.
        "src/app/**/*.css",
        "src/app/favicon.ico",
        // Framework glue / thin third-party SDK wrappers (no logic to unit-test).
        "src/middleware.ts",
        "src/i18n/**/*",
        "src/lib/supabase/**/*",
        // Server actions & route handlers exercised via integration/E2E, not units.
        "src/app/api/**/*",
        "src/lib/auth/actions.ts",
        "src/lib/auth/session.ts",
        // Unused shadcn primitive.
        "src/components/ui/card.tsx",
      ],
    },
  },
});
