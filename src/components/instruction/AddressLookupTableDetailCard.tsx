import React from "react";
import { TransactionInstruction, SignatureResult } from "@bbachain/web3.js";

// Components
import { InstructionCard } from "./InstructionCard";
import { parseAddressLookupTableInstructionTitle } from "./types";

// Hooks
import { useCluster } from "hooks/useCluster";

// Utils
import { reportError } from "utils/sentry";

export function AddressLookupTableDetailCard({
  ix,
  index,
  result,
  signature,
  innerCards,
  childIndex,
}: {
  ix: TransactionInstruction;
  index: number;
  result: SignatureResult;
  signature: string;
  innerCards?: JSX.Element[];
  childIndex?: number;
}) {
  const { url } = useCluster();

  let title: any;
  try {
    title = parseAddressLookupTableInstructionTitle(ix);
  } catch (error) {
    reportError(error, {
      url: url,
      signature: signature,
    });
  }

  return (
    <InstructionCard
      ix={ix}
      index={index}
      result={result}
      title={`Address Lookup Table: ${title || "Unknown"}`}
      innerCards={innerCards}
      childIndex={childIndex}
      defaultRaw
    />
  );
}
