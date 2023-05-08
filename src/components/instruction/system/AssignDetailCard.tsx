import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AssignInfo } from "./types";

export function AssignDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AssignInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="System Program: Assign Account"
      innerCards={innerCards}
      childIndex={childIndex}
    >
      <tr>
        <td>Program</td>
        <td className="text-lg-end">
          <Address pubkey={SystemProgram.programId} link />
        </td>
      </tr>

      <tr>
        <td>Account Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.account} link />
        </td>
      </tr>

      <tr>
        <td>Assigned Program Id</td>
        <td className="text-lg-end">
          <Address pubkey={info.owner} link />
        </td>
      </tr>
    </InstructionCard>
  );
}
