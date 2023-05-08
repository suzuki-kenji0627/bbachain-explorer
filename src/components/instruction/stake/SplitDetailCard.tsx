import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { Balance } from "components/common/Balance";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { SplitInfo } from "./types";

export function SplitDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: SplitInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Stake Program: Split Stake"
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
        <td>Authority Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.stakeAuthority} link />
        </td>
      </tr>

      <tr>
        <td>New Stake Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.newSplitAccount} link />
        </td>
      </tr>

      <tr>
        <td>Split Amount (BBA)</td>
        <td className="text-lg-end">
          <Balance daltons={info.lamports} />
        </td>
      </tr>
    </InstructionCard>
  );
}
