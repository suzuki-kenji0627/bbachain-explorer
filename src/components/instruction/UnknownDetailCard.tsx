import React from "react";
import {
  TransactionInstruction,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";

// Components
import { InstructionCard } from "./InstructionCard";
// Hooks
import { useCluster } from "hooks/useCluster";

// Utils
import { getProgramName } from "utils/tx";

export function UnknownDetailCard({
  ix,
  index,
  result,
  innerCards,
  childIndex,
}: {
  ix: TransactionInstruction | ParsedInstruction;
  index: number;
  result: SignatureResult;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { cluster } = useCluster();
  const programName = getProgramName(ix.programId.toBase58(), cluster);
  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title={`${programName}: Unknown Instruction`}
      innerCards={innerCards}
      childIndex={childIndex}
      defaultRaw
    />
  );
}
