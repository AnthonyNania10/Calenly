import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturePlaceholder({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="grid min-h-[32rem] place-items-center p-8 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
          <Button
            className="mt-6"
            variant="outline"
            render={<Link href="/dashboard" />}
          >
            <ArrowLeft />
            Back to dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
