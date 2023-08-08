import React from "react";

export function PubKey({
  pubkey,
  truncateChars,
}: {
  pubkey: string;
  truncateChars?: number;
}) {
  if (truncateChars) {
    return (
      <span>
        <span className="font-monospace">
          {pubkey.slice(0, truncateChars) + "…"}
        </span>
      </span>
    );
  }
  return (
    <span>
      <span className="font-monospace">{pubkey}</span>
    </span>
  );
}
