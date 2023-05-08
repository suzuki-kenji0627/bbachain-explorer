import React from "react";
import { toBalanceString } from "utils";

export function Balance({
  daltons,
  maximumFractionDigits = 9,
}: {
  daltons: number | bigint;
  maximumFractionDigits?: number;
}) {
  return (
    <span>
      <span className="font-monospace">
        {`${toBalanceString(daltons, maximumFractionDigits)} BBA`}
      </span>
    </span>
  );
}
