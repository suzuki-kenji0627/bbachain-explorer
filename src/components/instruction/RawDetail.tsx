import React from "react";
import { TransactionInstruction } from "@bbachain/web3.js";
import { Chip, Box, Typography, TableRow, TableCell } from "@mui/material";
import { Address } from "components/common/Address";
import { HexData } from "components/common/HexData";

export function RawDetail({ ix }: { ix: TransactionInstruction }) {
  return (
    <>
      {ix.keys.map(({ pubkey, isSigner, isWritable }, keyIndex) => (
        <TableRow key={keyIndex}>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
              fontWeight: 600,
              color: "text.secondary",
              width: "200px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Account #{keyIndex + 1}
              </Typography>
              {isWritable && (
                <Chip
                  label="Writable"
                  color="info"
                  size="small"
                  sx={{ fontSize: "0.75rem", height: 20 }}
                />
              )}
              {isSigner && (
                <Chip
                  label="Signer"
                  color="info"
                  size="small"
                  sx={{ fontSize: "0.75rem", height: 20 }}
                />
              )}
            </Box>
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Address pubkey={pubkey} link />
          </TableCell>
        </TableRow>
      ))}

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
            (Hex)
          </Typography>
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <HexData raw={ix.data} />
        </TableCell>
      </TableRow>
    </>
  );
}
