import { SignatureStatus } from "@bbachain/web3.js";
import React from "react";
import { toBalanceString } from "utils";

export function Confirmations({
  confirmations,
}: {
  confirmations: SignatureStatus | null;
}) {
  return confirmations ? (
    <span>
      {confirmations.confirmationStatus === "confirmed" && (
        <span className="font-monospace">{confirmations.confirmations}</span>
      )}
      {confirmations.confirmationStatus === "processed" && (
        <span className="font-monospace">{confirmations.confirmations}</span>
      )}
      {confirmations.confirmationStatus === "finalized" && (
        <span className="font-monospace">max</span>
      )}
    </span>
  ) : (
    <span>
      <span className="font-monospace">0</span>
    </span>
  );
}
