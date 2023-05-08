import React from "react";
import {
  SystemProgram,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { Balance } from "components/common/Balance";
import { InstructionCard } from "../InstructionCard";
import { Address } from "components/common/Address";
import { WithdrawNonceInfo } from "./types";

export function NonceWithdrawDetailCard(props: {
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  info: WithdrawNonceInfo;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { ix, index, result, info, innerCards, childIndex } = props;

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title="System Program: Withdraw Nonce"
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
        <td>Nonce Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.nonceAccount} link />
        </td>
      </tr>

      <tr>
        <td>Authority Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.nonceAuthority} link />
        </td>
      </tr>

      <tr>
        <td>To Address</td>
        <td className="text-lg-end">
          <Address pubkey={info.destination} link />
        </td>
      </tr>

      <tr>
        <td>Withdraw Amount (BBA)</td>
        <td className="text-lg-end">
          <Balance daltons={info.daltons} />
        </td>
      </tr>
    </InstructionCard>
  );
}
