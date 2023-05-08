import React from "react";
import { BigNumber } from "bignumber.js";
import { Balance } from "./Balance";

export function BalanceDelta({
  delta,
  isBBA = false,
}: {
  delta: BigNumber;
  isBBA?: boolean;
}) {
  let amount: any;

  if (isBBA) {
    amount = <Balance daltons={Math.abs(delta.toNumber())} />;
  }

  if (delta.gt(0)) {
    return (
      <span className="badge bg-success-soft">
        +{isBBA ? amount : delta.toString()}
      </span>
    );
  } else if (delta.lt(0)) {
    return (
      <span className="badge bg-warning-soft">
        {isBBA ? <>-{amount}</> : delta.toString()}
      </span>
    );
  }

  return <span className="badge bg-secondary-soft">0</span>;
}
