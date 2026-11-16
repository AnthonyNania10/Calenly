"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck2,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  Menu,
  PlugZap,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

import { useLocalState } from "@/components/local-state-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Requests", href: "/requests", icon: CalendarCheck2 },
  { label: "My Availability", href: "/availability", icon: Clock3 },
  { label: "Connections", href: "/connections", icon: PlugZap },
  { label: "Settings", href: "/settings", icon: Settings },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Workspace navigation">
      {navigation.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
            {active && <ChevronRight className="ml-auto size-3.5" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state, hydrated } = useLocalState();
  const title =
    navigation.find((item) => item.href === pathname)?.label ?? "OpenCal";

  return (
    <div className="min-h-screen bg-muted/35">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card/95 p-4 backdrop-blur lg:flex lg:flex-col">
        <Link
          href="/dashboard"
          className="mb-8 flex h-10 items-center gap-2 px-2 font-semibold tracking-tight"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <CalendarDays className="size-4.5" aria-hidden="true" />
          </span>
          OpenCal
        </Link>
        <Navigation />
        <div className="mt-auto rounded-2xl border bg-background p-3">
          <div className="flex items-center gap-3">
            <Avatar>
              {state.profile.avatarUrl && (
                <AvatarImage src={state.profile.avatarUrl} alt="" />
              )}
              <AvatarFallback>
                {initials(state.profile.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {hydrated ? state.profile.fullName : "Loading profile…"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                /{state.profile.username}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur lg:ml-64">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
            <div>
              <p className="text-xs text-muted-foreground">Workspace</p>
              <h1 className="font-semibold tracking-tight">{title}</h1>
            </div>
          </div>
          <Link
            href="/settings"
            className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Profile settings"
          >
            <CircleUserRound className="size-5" />
          </Link>
        </div>
        {mobileOpen && (
          <div className="border-t bg-background px-5 py-4 lg:hidden">
            <Navigation onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
