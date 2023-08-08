import {
  ParsedMessageAccount,
  SignatureStatus,
  PublicKey,
} from "@bbachain/web3.js";
import React from "react";
import { toBalanceString } from "utils";

export function Signer({
  signer,
  truncateChars,
}: {
  signer: string;
  truncateChars?: number;
}) {
  return (
    <span>
      <span className="font-monospace">
        {signer.slice(0, truncateChars || 0) + "…"}
      </span>
    </span>
  );
}
