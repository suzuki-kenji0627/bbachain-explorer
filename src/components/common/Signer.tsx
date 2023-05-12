import { ParsedMessageAccount, SignatureStatus } from "@bbachain/web3.js";
import React from "react";
import { toBalanceString } from "utils";

export function Signer({
  accountKeys,
}: {
  accountKeys: ParsedMessageAccount[];
}) {
  return (
    <span>
      <span className="font-monospace">
        {accountKeys.filter((acc) => acc.signer)[0].pubkey.toString()}
      </span>
    </span>
  );
}
