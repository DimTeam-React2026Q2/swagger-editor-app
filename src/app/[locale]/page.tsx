import { ReactElement } from "react";
import SwaggerDashboard from "@/components/swagger/SwaggerDashboard";

export default function Home(): ReactElement {
  return (
    <main className="min-h-screen w-full bg-[#1b1b1b]">
      <SwaggerDashboard />
    </main>
  );
}
