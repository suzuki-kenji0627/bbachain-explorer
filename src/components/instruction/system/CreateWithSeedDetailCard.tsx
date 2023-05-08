import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { CreateAccountWithSeedInfo } from "./types";
import { Balance } from "components/common/Balance";

export function CreateWithSeedDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: CreateAccountWithSeedInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="System Program: Create Account w/ Seed"
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
        <td>From Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.source} link />
        </td>
      </tr>

      <tr>
        <td>New Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.newAccount} link />
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
        <td>Transfer Amount (BBA)</td>
        <td className="text-lg-end">
          <Balance daltons={info.daltons} />
        </td>
      </tr>

      <tr>
        <td>Allocated Data Size</td>
        <td className="text-lg-end">{info.space} byte(s)</td>
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
