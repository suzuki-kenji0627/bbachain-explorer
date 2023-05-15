import { ParsedMessageAccount, SignatureStatus } from "@bbachain/web3.js";
import React from "react";
import { toBalanceString } from "utils";

export function Time({ timestamp }: { timestamp: number }) {
  return (
    <span>
      <div className="text-sm opacity-50">
        {Math.round(Date.now() / 1000) - timestamp} seconds ago
      </div>
    </span>
  );
}
