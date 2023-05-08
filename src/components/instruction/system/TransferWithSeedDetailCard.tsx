import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { Balance } from "components/common/Balance";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { TransferWithSeedInfo } from "./types";

export function TransferWithSeedDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: TransferWithSeedInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="System Program: Transfer w/ Seed"
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
        <td>Destination Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.destination} link />
        </td>
      </tr>

      <tr>
        <td>Base Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.sourceBase} link />
        </td>
      </tr>

      <tr>
        <td>Transfer Amount (BBA)</td>
        <td className="text-lg-end">
          <Balance daltons={info.daltons} />
        </td>
      </tr>

      <tr>
        <td>Seed</td>
        <td className="text-lg-end">
          <code>{info.sourceSeed}</code>
        </td>
      </tr>

      <tr>
        <td>Source Owner</td>
        <td className="text-lg-end">
          <Address pubkey={info.sourceOwner} link />
        </td>
      </tr>
    </InstructionCard>
  );
}
