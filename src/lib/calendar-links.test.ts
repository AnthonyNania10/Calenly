import { describe, expect, it } from "vitest";

import {
  displayNameFromUsername,
  parseCalendarLink,
} from "@/lib/calendar-links";

describe("parseCalendarLink", () => {
  it.each([
    ["https://opencal.local/maya-chen", "maya-chen"],
    ["opencal.local/sam_rivera", "sam_rivera"],
    ["/taylor", "taylor"],
    ["@jamie", "jamie"],
  ])("extracts a normalized username from %s", (value, username) => {
    expect(parseCalendarLink(value)).toEqual({
      username,
      canonicalPath: `/${username}`,
    });
  });

  it.each([
    "",
    "https://opencal.local/",
    "https://opencal.local/people/maya",
    "https://opencal.local/ab",
    "https://opencal.local/../admin",
    "not a valid username",
  ])("rejects invalid or ambiguous links: %s", (value) => {
    expect(parseCalendarLink(value)).toBeNull();
  });
});

describe("displayNameFromUsername", () => {
  it("turns separators into readable words", () => {
    expect(displayNameFromUsername("maya-chen")).toBe("Maya Chen");
    expect(displayNameFromUsername("sam_rivera")).toBe("Sam Rivera");
  });
});
