import Link from "next/link";
import { ArrowLeft, CalendarX2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="max-w-md text-center">
        <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <CalendarX2 className="size-5" aria-hidden="true" />
        </div>
        <p className="font-mono text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          This time slot does not exist
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page may have moved, or the address may be incorrect.
        </p>
        <Button className="mt-6" render={<Link href="/" />}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to OpenCal
        </Button>
      </section>
    </main>
  );
}
