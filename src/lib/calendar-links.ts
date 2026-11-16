export const CALENDAR_USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{2,29}$/;

export type ParsedCalendarLink = {
  username: string;
  canonicalPath: string;
};

export function parseCalendarLink(value: string): ParsedCalendarLink | null {
  const input = value.trim();
  if (!input) return null;
  if (input.includes("..") || /%2e/i.test(input)) return null;

  let candidate = input.replace(/^@/, "");

  try {
    if (/^https?:\/\//i.test(input)) {
      const url = new URL(input);
      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length !== 1) return null;
      candidate = decodeURIComponent(segments[0]);
    } else if (input.startsWith("/")) {
      const segments = input.split(/[/?#]/).filter(Boolean);
      if (segments.length !== 1) return null;
      candidate = decodeURIComponent(segments[0]);
    } else if (input.includes("/") || input.includes(".")) {
      const url = new URL(`https://${input}`);
      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length !== 1) return null;
      candidate = decodeURIComponent(segments[0]);
    }
  } catch {
    return null;
  }

  const username = candidate.trim().toLowerCase();
  if (!CALENDAR_USERNAME_PATTERN.test(username)) return null;

  return { username, canonicalPath: `/${username}` };
}

export function displayNameFromUsername(username: string) {
  return username
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
