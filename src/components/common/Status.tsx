import { SignatureStatus } from "@bbachain/web3.js";
import React from "react";
import { toBalanceString } from "utils";

export function Status({
  confirmations,
}: {
  confirmations: SignatureStatus | null;
}) {
  return confirmations ? (
    <span>
      <span className="font-monospace">{confirmations.confirmationStatus}</span>
    </span>
  ) : (
    <span>
      <span className="font-monospace">Failed</span>
    </span>
  );
}
