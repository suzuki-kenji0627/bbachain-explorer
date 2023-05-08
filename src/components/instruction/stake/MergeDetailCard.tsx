
import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { MergeInfo } from "./types";

export function MergeDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: MergeInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Stake Program: Merge Stake"
      innerCards={innerCards}
      childIndex={childIndex}
    >
      <tr>
        <td>Program</td>
        <td className="text-lg-end">
          <Address pubkey={StakeProgram.programId} link />
        </td>
      </tr>

      <tr>
        <td>Stake Source</td>
        <td className="text-lg-end">
          <Address pubkey={info.source} link />
        </td>
      </tr>

      <tr>
        <td>Stake Destination</td>
        <td className="text-lg-end">
          <Address pubkey={info.destination} link />
        </td>
      </tr>

      <tr>
        <td>Authority Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.stakeAuthority} link />
        </td>
      </tr>

      <tr>
        <td>Clock Sysvar</td>
        <td className="text-lg-end">
          <Address pubkey={info.clockSysvar} link />
        </td>
      </tr>

      <tr>
        <td>Stake History Sysvar</td>
        <td className="text-lg-end">
          <Address pubkey={info.stakeHistorySysvar} link />
        </td>
      </tr>
    </InstructionCard>
  );
}
