import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { AssignWithSeedInfo } from "./types";

export function AssignWithSeedDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: AssignWithSeedInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="System Program: Assign Account w/ Seed"
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
        <td>Base Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.base} link />
        </td>
      </tr>

      <tr>
        <td>Seed</td>
        <td className="text-lg-end">
          <code>{info.seed}</code>
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
