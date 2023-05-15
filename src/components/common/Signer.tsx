import { ParsedMessageAccount, SignatureStatus } from "@bbachain/web3.js";
import React from "react";
import { toBalanceString } from "utils";

export function Signer({
  accountKeys,
  truncateChars,
}: {
  accountKeys: ParsedMessageAccount[];
  truncateChars?: number;
}) {
  let signerLabel = accountKeys
    .filter((acc) => acc.signer)[0]
    .pubkey.toString();

  if (truncateChars) {
    signerLabel = signerLabel.slice(0, truncateChars) + "…";
  }
  return (
    <span>
      <span className="font-monospace">{signerLabel}</span>
    </span>
  );
}
