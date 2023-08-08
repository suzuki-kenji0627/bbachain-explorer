import useQueryContext from "hooks/useQueryContext";
import Link from "next/link";
import React from "react";

export function PubKey({
  pubkey,
  truncateChars,
  link,
}: {
  pubkey: string;
  truncateChars?: number;
  link?: boolean;
}) {
  const { fmtUrlWithCluster } = useQueryContext();
  if (truncateChars) {
    return (
      <span>
        <span className="font-monospace">
          {link ? (
            <Link href={fmtUrlWithCluster(`/address/${pubkey}`)}>
              {pubkey.slice(0, truncateChars) + "…"}
            </Link>
          ) : (
            pubkey.slice(0, truncateChars) + "…"
          )}
        </span>
      </span>
    );
  }
  return (
    <span>
      <span className="font-monospace">
        {link ? (
          <Link href={fmtUrlWithCluster(`/address/${pubkey}`)}>{pubkey}</Link>
        ) : (
          pubkey
        )}
      </span>
    </span>
  );
}
