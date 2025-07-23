import React from "react";
import { ParsedInstruction } from "@bbachain/web3.js";
import { TableRow, TableCell, Typography } from "@mui/material";

export function RawParsedDetail({
  ix,
  children,
}: {
  ix: ParsedInstruction;
  children?: React.ReactNode;
}) {
  return (
    <>
      {children}

      <TableRow>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
            fontWeight: 600,
            color: "text.secondary",
            width: "200px",
          }}
        >
          Instruction Data{" "}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary", opacity: 0.7 }}
          >
            (JSON)
          </Typography>
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            component="pre"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 1,
              p: 2,
              margin: 0,
            }}
          >
            {JSON.stringify(ix.parsed, null, 2)}
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
}
