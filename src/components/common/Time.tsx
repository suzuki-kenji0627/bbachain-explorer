import React, { useState, useEffect } from "react";

export function Time({ timestamp }: { timestamp: number }) {
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const secondsAgo = Math.round(Date.now() / 1000) - timestamp;

      if (secondsAgo < 60) {
        setTimeAgo(`${secondsAgo} seconds ago`);
      } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        setTimeAgo(`${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`);
      } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        setTimeAgo(`${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`);
      } else {
        const daysAgo = Math.floor(secondsAgo / 86400);
        setTimeAgo(`${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  // Return empty during SSR to avoid hydration mismatch
  if (!mounted) {
    return <div className="text-sm opacity-50">Loading...</div>;
  }

  return <div className="text-sm opacity-50">{timeAgo}</div>;
}
