import React from "react";
import { Box } from "@mui/material";
import { toBalanceString } from "utils";
import { BBAIcon } from "./BBAIcon";

export function Balance({
  daltons,
  maximumFractionDigits = 9,
}: {
  daltons: number | bigint;
  maximumFractionDigits?: number;
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        fontFamily: "monospace",
      }}
    >
      <span>{toBalanceString(daltons, maximumFractionDigits)}</span>
      <BBAIcon size={16} />
    </Box>
  );
}
