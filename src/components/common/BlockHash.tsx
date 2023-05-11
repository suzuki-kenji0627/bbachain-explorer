import React from "react";
import Link from "next/link";
import { Blockhash } from "@bbachain/web3.js";
import useQueryContext from "hooks/useQueryContext";

type Props = {
  hash: Blockhash;
  blockNumber: number;
  alignRight?: boolean;
  link?: boolean;
  truncate?: boolean;
  truncateChars?: number;
};

export function BlockHash({
  hash,
  blockNumber,
  alignRight,
  link,
  truncate,
  truncateChars,
}: Props) {
  const {fmtUrlWithCluster} = useQueryContext();
  let hashLabel = hash;

  if (truncateChars) {
    hashLabel = hash.slice(0, truncateChars) + "…";
  }

  return (
    <div className={`d-flex align-items-center ${alignRight ? "justify-content-end" : ""}`}>
      <span className="font-monospace">
        {link ? (
          <Link className={truncate ? "text-truncate signature-truncate" : ""} href={fmtUrlWithCluster(`/block/${blockNumber}`)}>
            {hashLabel}
          </Link>
        ) : (
          hashLabel
        )}
      </span>
    </div>
  );
}
