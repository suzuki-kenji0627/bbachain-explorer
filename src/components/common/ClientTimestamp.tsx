import React, { useState, useEffect } from "react";
import { getClientTimestamp } from "utils/date";

interface ClientTimestampProps {
  timestamp: number;
  utc?: boolean;
  includeTime?: boolean;
}

export function ClientTimestamp({
  timestamp,
  utc = false,
  includeTime = false,
}: ClientTimestampProps) {
  const [mounted, setMounted] = useState(false);
  const [timeString, setTimeString] = useState("--:--");

  useEffect(() => {
    setMounted(true);
    setTimeString(getClientTimestamp(timestamp, utc, includeTime));
  }, [timestamp, utc, includeTime]);

  if (!mounted) {
    return <span>--:--</span>;
  }

  return <span>{timeString}</span>;
}
