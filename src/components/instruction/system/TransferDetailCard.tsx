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
        <TableCell>Program</TableCell>
        <TableCell>
          <Address pubkey={SystemProgram.programId} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>From Address</TableCell>
        <TableCell>
          <Address pubkey={info.source} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>To Address</TableCell>
        <TableCell>
          <Address pubkey={info.destination} link />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Transfer Amount (BBA)</TableCell>
        <TableCell>
          <Balance daltons={info.daltons} />
        </TableCell>
      </TableRow>
    </InstructionCard>
  );
}
