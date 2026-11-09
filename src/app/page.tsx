import { AppHeader } from "@/components/app-header";
import { FoundationGrid } from "@/components/landing/foundation-grid";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <Hero />
        <FoundationGrid />
      </main>
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>OpenCal — make time feel like yours.</p>
          <p>Foundation ready. Product flows follow in Phase 2.</p>
        </div>
      </footer>
    </div>
  );
}
