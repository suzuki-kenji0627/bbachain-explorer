import React from "react";
import { PublicKey } from "@bbachain/web3.js";
import { create, Struct } from "superstruct";
import { TableRow, TableCell, Typography } from "@mui/material";
import { ParsedInfo } from "validators";
import {
  UpdateCommissionInfo,
  UpdateValidatorInfo,
  VoteInfo,
  VoteSwitchInfo,
  WithdrawInfo,
  AuthorizeInfo,
} from "./types";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { displayTimestamp } from "utils/date";
import { UnknownDetailCard } from "../UnknownDetailCard";
import { InstructionDetailsProps } from "components/transaction/InstructionsSection";
import { camelToTitleCase } from "utils";
import { reportError } from "utils/sentry";
import { useCluster } from "hooks/useCluster";

export function VoteDetailCard(props: InstructionDetailsProps) {
  const { url } = useCluster();

  try {
    const parsed = create(props.ix.parsed, ParsedInfo);

    switch (parsed.type) {
      case "vote":
        return renderDetails<VoteInfo>(props, parsed, VoteInfo);
      case "authorize":
        return renderDetails<AuthorizeInfo>(props, parsed, AuthorizeInfo);
      case "withdraw":
        return renderDetails<WithdrawInfo>(props, parsed, WithdrawInfo);
      case "updateValidator":
        return renderDetails<UpdateValidatorInfo>(
          props,
          parsed,
          UpdateValidatorInfo
        );
      case "updateCommission":
        return renderDetails<UpdateCommissionInfo>(
          props,
          parsed,
          UpdateCommissionInfo
        );
      case "voteSwitch":
        return renderDetails<VoteSwitchInfo>(props, parsed, VoteSwitchInfo);
    }
  } catch (error) {
    reportError(error, {
      url,
    });
  }

  return <UnknownDetailCard {...props} />;
}

function renderDetails<T>(
  props: InstructionDetailsProps,
  parsed: ParsedInfo,
  struct: Struct<T>
) {
  const info = create(parsed.info, struct);
  const attributes: JSX.Element[] = [];

  for (let [key, value] of Object.entries(info)) {
    if (value instanceof PublicKey) {
      value = <Address pubkey={value} link />;
    }

    if (key === "vote") {
      attributes.push(
        <TableRow key="vote-hash">
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
              fontWeight: 600,
              color: "text.secondary",
              width: "200px",
            }}
          >
            Vote Hash
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
              {value.hash}
            </Typography>
          </TableCell>
        </TableRow>
      );

      if (value.timestamp) {
        attributes.push(
          <TableRow key="timestamp">
            <TableCell
              sx={{
                borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                py: 2,
                fontWeight: 600,
                color: "text.secondary",
                width: "200px",
              }}
            >
              Timestamp
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
                {displayTimestamp(value.timestamp * 1000)}
              </Typography>
            </TableCell>
          </TableRow>
        );
      }

      attributes.push(
        <TableRow key="vote-slots">
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
              fontWeight: 600,
              color: "text.secondary",
              width: "200px",
            }}
          >
            Slots
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
                whiteSpace: "pre-line",
              }}
            >
              {value.slots.join("\n")}
            </Typography>
          </TableCell>
        </TableRow>
      );
    } else {
      attributes.push(
        <TableRow key={key}>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
              fontWeight: 600,
              color: "text.secondary",
              width: "200px",
            }}
          >
            {camelToTitleCase(key)}
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            {value}
          </TableCell>
        </TableRow>
      );
    }
  }

  return (
    <InstructionCard
      {...props}
      title={`Vote: ${camelToTitleCase(parsed.type)}`}
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
          <Address pubkey={props.ix.programId} link />
        </TableCell>
      </TableRow>
      {attributes}
    </InstructionCard>
  );
}
