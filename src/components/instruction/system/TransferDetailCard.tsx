import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { TableRow, TableCell } from "@mui/material";
import { Balance } from "components/common/Balance";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { TransferInfo } from "./types";

export function TransferDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: TransferInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="System Program: Transfer"
      innerCards={innerCards}
      childIndex={childIndex}
    >
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
          Program
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={SystemProgram.programId} link />
        </TableCell>
      </TableRow>

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
          From Address
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={info.source} link />
        </TableCell>
      </TableRow>

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
          To Address
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={info.destination} link />
        </TableCell>
      </TableRow>

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
          Transfer Amount (BBA)
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Balance daltons={info.daltons} />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
