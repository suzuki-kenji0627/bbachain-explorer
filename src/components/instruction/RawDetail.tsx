import React from "react";
import { TransactionInstruction } from "@bbachain/web3.js";
import { Chip, Box, Typography } from "@mui/material";
import { Address } from "components/common/Address";
import { HexData } from "components/common/HexData";

export function RawDetail({ ix }: { ix: TransactionInstruction }) {
  return (
    <>
      {ix.keys.map(({ pubkey, isSigner, isWritable }, keyIndex) => (
        <tr key={keyIndex}>
          <td>
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
          </td>
          <td className="text-lg-end">
            <Address pubkey={pubkey} link />
          </td>
        </tr>
      ))}

      <tr>
        <td>
          Instruction Data <span className="text-muted">(Hex)</span>
        </td>
        <td className="text-lg-end">
          <HexData raw={ix.data} />
        </td>
      </tr>
    </>
  );
}
