import React from "react";
import {
  SignatureResult,
  StakeProgram,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AuthorizeInfo } from "./types";

export function AuthorizeDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AuthorizeInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="Stake Program: Authorize"
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
        <td>Old Authority Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.authority} link />
        </td>
      </tr>

      <tr>
        <td>New Authority Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.newAuthority} link />
        </td>
      </tr>

      <tr>
        <td>Authority Type</td>
        <td className="text-lg-end">{info.authorityType}</td>
      </tr>
    </InstructionCard>
  );
}
