import React from "react";
import {
  SignatureResult,
  StakeProgram,
  SystemProgram,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { TableRow, TableCell, Typography } from "@mui/material";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { InitializeInfo } from "./types";
import { displayTimestampUtc } from "utils/date";
import { Epoch } from "components/common/Epoch";

export function InitializeDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: InitializeInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Stake Program: Initialize Stake"
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
          <Address pubkey={StakeProgram.programId} link />
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
          Stake Address
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={info.stakeAccount} link />
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
          Stake Authority Address
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={info.authorized.staker} link />
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
          Withdraw Authority Address
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={info.authorized.withdrawer} link />
        </TableCell>
      </TableRow>

      {info.lockup.epoch > 0 && (
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
            Lockup Expiry Epoch
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Epoch epoch={info.lockup.epoch} link />
          </TableCell>
        </TableRow>
      )}

      {info.lockup.unixTimestamp > 0 && (
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
            Lockup Expiry Timestamp
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {displayTimestampUtc(info.lockup.unixTimestamp * 1000)}
            </Typography>
          </TableCell>
        </TableRow>
      )}

      {info.lockup.custodian && (
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
            Lockup Custodian
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Address pubkey={info.lockup.custodian} link />
          </TableCell>
        </TableRow>
      )}
    </InstructionCard>
  );
}
