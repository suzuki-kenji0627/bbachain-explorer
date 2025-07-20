export function displayTimestamp(
  timestamp: number,
  includeTime?: boolean
): string {
  const date = new Date(timestamp);

  if (includeTime) {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function displayTimestampUtc(
  timestamp: number,
  includeTime?: boolean
): string {
  const date = new Date(timestamp);

  if (includeTime) {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Client-only timestamp string to avoid hydration mismatch
export function getClientTimestamp(
  timestamp: number,
  utc = false,
  includeTime = false
): string {
  // Return placeholder during SSR
  if (typeof window === "undefined") {
    return "--:--";
  }

  const displayFn = utc ? displayTimestampUtc : displayTimestamp;
  return displayFn(timestamp, includeTime);
}
