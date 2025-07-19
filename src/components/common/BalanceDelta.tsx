import React from "react";
import { BigNumber } from "bignumber.js";
import { Chip, Box } from "@mui/material";
import { Balance } from "./Balance";

export function BalanceDelta({
  delta,
  isBBA = false,
}: {
  delta: BigNumber;
  isBBA?: boolean;
}) {
  if (delta.gt(0)) {
    return (
      <Chip
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            +
            {isBBA ? (
              <Balance daltons={Math.abs(delta.toNumber())} />
            ) : (
              delta.toString()
            )}
          </Box>
        }
        color="success"
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  } else if (delta.lt(0)) {
    return (
      <Chip
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            -
            {isBBA ? (
              <Balance daltons={Math.abs(delta.toNumber())} />
            ) : (
              Math.abs(delta.toNumber()).toString()
            )}
          </Box>
        }
        color="warning"
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  }

  return (
    <Chip label="0" color="default" size="small" sx={{ fontWeight: 500 }} />
  );
}
