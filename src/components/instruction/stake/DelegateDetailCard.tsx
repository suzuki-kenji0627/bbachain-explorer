import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { DelegateInfo } from "./types";

export function DelegateDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: DelegateInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Stake Program: Delegate Stake"
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
        <td>Stake Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.stakeAccount} link />
        </td>
      </tr>

      <tr>
        <td>Delegated Vote Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.voteAccount} link />
        </td>
      </tr>

      <tr>
        <td>Authority Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.stakeAuthority} link />
        </td>
      </tr>
    </InstructionCard>
  );
}
