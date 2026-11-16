"use client";

import { useState } from "react";
import { Check, Copy, RotateCcw, Save } from "lucide-react";

import { useLocalState } from "@/components/local-state-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  profileSchema,
  type LocalProfile,
} from "@/lib/local-state";

type ProfileFormProps = {
  profile: LocalProfile;
  timezones: string[];
  onSave: (profile: LocalProfile) => boolean;
  onReset: () => void;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function ProfileForm({
  profile,
  timezones,
  onSave,
  onReset,
}: ProfileFormProps) {
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (field: keyof LocalProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = profileSchema.safeParse(draft);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      setSaved(false);
      return;
    }

    setErrors({});
    setSaved(onSave(parsed.data));
  };

  const copyPublicUrl = async () => {
    const url = `${window.location.origin}/${draft.username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <p className="text-sm text-muted-foreground">
            This profile is private to this browser in local-first mode.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {saved && (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                <Check />
                <AlertTitle>Saved locally</AlertTitle>
                <AlertDescription>
                  Your profile is stored in this browser.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.[0]}>
                <Input
                  value={draft.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  autoComplete="name"
                />
              </Field>
              <Field label="Username" error={errors.username?.[0]}>
                <div className="flex items-center rounded-lg border bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                  <span className="pl-2.5 text-sm text-muted-foreground">@</span>
                  <Input
                    value={draft.username}
                    onChange={(event) => update("username", event.target.value)}
                    className="border-0 shadow-none focus-visible:ring-0"
                    autoComplete="username"
                  />
                </div>
              </Field>
            </div>

            <Field label="Email" error={errors.email?.[0]}>
              <Input
                value={draft.email}
                onChange={(event) => update("email", event.target.value)}
                type="email"
                autoComplete="email"
              />
            </Field>

            <Field label="Avatar URL" error={errors.avatarUrl?.[0]}>
              <Input
                value={draft.avatarUrl}
                onChange={(event) => update("avatarUrl", event.target.value)}
                type="url"
                placeholder="https://example.com/avatar.jpg"
              />
            </Field>

            <Field label="Bio" error={errors.bio?.[0]}>
              <Textarea
                value={draft.bio}
                onChange={(event) => update("bio", event.target.value)}
                rows={4}
                maxLength={280}
              />
              <p className="text-right text-xs text-muted-foreground">
                {draft.bio.length}/280
              </p>
            </Field>

            <Field label="Timezone" error={errors.timezone?.[0]}>
              <select
                value={draft.timezone}
                onChange={(event) => update("timezone", event.target.value)}
                className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {timezones.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onReset();
                  setDraft(profile);
                  setErrors({});
                  setSaved(false);
                }}
              >
                <RotateCcw />
                Reset demo data
              </Button>
              <Button type="submit">
                <Save />
                Save profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Profile preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                {draft.avatarUrl && <AvatarImage src={draft.avatarUrl} alt="" />}
                <AvatarFallback>{initials(draft.fullName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{draft.fullName}</p>
                <p className="truncate text-sm text-muted-foreground">
                  @{draft.username}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {draft.bio || "Add a short bio to introduce yourself."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public scheduling URL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="break-all rounded-lg bg-muted p-3 font-mono text-xs">
              opencal.local/{draft.username}
            </p>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={copyPublicUrl}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy URL"}
            </Button>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Preview only. Public booking pages are not included in this local
              shell.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SettingsContent({ timezones }: { timezones: string[] }) {
  const { state, hydrated, updateProfile, reset } = useLocalState();

  if (!hydrated) {
    return (
      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="h-[40rem] animate-pulse rounded-2xl bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <ProfileForm
      key={JSON.stringify(state.profile)}
      profile={state.profile}
      timezones={timezones}
      onSave={updateProfile}
      onReset={reset}
    />
  );
}
