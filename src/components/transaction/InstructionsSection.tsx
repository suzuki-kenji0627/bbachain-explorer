import React from "react";
import {
  ComputeBudgetProgram,
  ParsedInnerInstruction,
  ParsedInstruction,
  ParsedTransaction,
  PartiallyDecodedInstruction,
  SignatureResult,
  TransactionSignature,
} from "@bbachain/web3.js";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { INNER_INSTRUCTIONS_START_SLOT, SignatureProps } from "views/tx";

// Components
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { isAddressLookupTableInstruction } from "components/instruction/types";
import { StakeDetailCard } from "components/instruction/stake/StakeDetailCard";
import { SystemDetailCard } from "components/instruction/system/SystemDetailCard";
import { UnknownDetailCard } from "components/instruction/UnknownDetailCard";
import { VoteDetailCard } from "components/instruction/vote/VoteDetailCard";
import { ComputeBudgetDetailCard } from "components/instruction/ComputeBudgetDetailCard";
import { AddressLookupTableDetailCard } from "components/instruction/AddressLookupTableDetailCard";

// Hooks
import { Cluster, useCluster } from "hooks/useCluster";
import { useTransaction } from "hooks/useTransaction";
import {
  useFetchTransactionDetail,
  useTransactionDetail,
} from "hooks/useTransactionDetail";

// Utils
import { intoTransactionInstruction } from "utils/tx";

export type InstructionDetailsProps = {
  tx: ParsedTransaction;
  ix: ParsedInstruction;
  index: number;
  result: SignatureResult;
  innerCards?: JSX.Element[];
  childIndex?: number;
};

export function InstructionsSection({ signature }: SignatureProps) {
  const status = useTransaction(signature);
  const details = useTransactionDetail(signature);
  const { cluster, url } = useCluster();
  const fetchDetails = useFetchTransactionDetail();
  const refreshDetails = () => fetchDetails(signature);

  const result = status?.data?.info?.result;
  const transactionWithMeta = details?.data?.transactionWithMeta;
  if (!result || !transactionWithMeta) {
    return <ErrorCard retry={refreshDetails} text="No instructions found" />;
  }
  const { meta, transaction } = transactionWithMeta;

  if (transaction.message.instructions.length === 0) {
    return <ErrorCard retry={refreshDetails} text="No instructions found" />;
  }

  const innerInstructions: {
    [index: number]: (ParsedInstruction | PartiallyDecodedInstruction)[];
  } = {};

  if (
    meta?.innerInstructions &&
    (cluster !== Cluster.Mainnet ||
      transactionWithMeta.slot >= INNER_INSTRUCTIONS_START_SLOT)
  ) {
    meta.innerInstructions.forEach((parsed: ParsedInnerInstruction) => {
      if (!innerInstructions[parsed.index]) {
        innerInstructions[parsed.index] = [];
      }

      parsed.instructions.forEach((ix) => {
        innerInstructions[parsed.index].push(ix);
      });
    });
  }

  return (
    <Card
      sx={{
        mb: 3,
        background:
          "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {transaction.message.instructions.length > 1
              ? "🔧 Instructions"
              : "🔧 Instruction"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <React.Suspense
            fallback={<LoadingCard message="Loading Instructions" />}
          >
            {transaction.message.instructions.map((instruction, index) => {
              let innerCards: JSX.Element[] = [];

              if (index in innerInstructions) {
                innerInstructions[index].forEach((ix, childIndex) => {
                  let res = (
                    <InstructionCard
                      key={`${index}-${childIndex}`}
                      index={index}
                      ix={ix}
                      result={result}
                      signature={signature}
                      tx={transaction}
                      childIndex={childIndex}
                      url={url}
                    />
                  );
                  innerCards.push(res);
                });
              }

              return (
                <InstructionCard
                  key={`${index}`}
                  index={index}
                  ix={instruction}
                  result={result}
                  signature={signature}
                  tx={transaction}
                  innerCards={innerCards}
                  url={url}
                />
              );
            })}
          </React.Suspense>
        </Box>
      </CardContent>
    </Card>
  );
}

function InstructionCard({
  ix,
  tx,
  result,
  index,
  signature,
  innerCards,
  childIndex,
  url,
}: {
  ix: ParsedInstruction | PartiallyDecodedInstruction;
  tx: ParsedTransaction;
  result: SignatureResult;
  index: number;
  signature: TransactionSignature;
  innerCards?: JSX.Element[];
  childIndex?: number;
  url: string;
}) {
  const key = `${index}-${childIndex}`;

  if ("parsed" in ix) {
    const props = {
      tx,
      ix,
      result,
      index,
      innerCards,
      childIndex,
      key,
    };

    switch (ix.program) {
      //   case "spl-token":
      //     return <TokenDetailCard {...props} />;
      //   case "bpf-loader":
      //     return <BpfLoaderDetailCard {...props} />;
      //   case "bpf-upgradeable-loader":
      //     return <BpfUpgradeableLoaderDetailCard {...props} />;
      case "system":
        return <SystemDetailCard {...props} />;
      case "stake":
        return <StakeDetailCard {...props} />;
      //   case "spl-memo":
      //     return <MemoDetailCard {...props} />;
      //   case "spl-associated-token-account":
      //     return <AssociatedTokenDetailCard {...props} />;
      case "vote":
        return <VoteDetailCard {...props} />;
      default:
        return <UnknownDetailCard {...props} />;
    }
  }

  const transactionIx = intoTransactionInstruction(tx, ix);

  if (!transactionIx) {
    return (
      <ErrorCard
        key={key}
        text="Could not display this instruction, please report"
      />
    );
  }

  const props = {
    ix: transactionIx,
    result,
    index,
    signature,
    innerCards,
    childIndex,
  };

  if (isAddressLookupTableInstruction(transactionIx)) {
    return <AddressLookupTableDetailCard key={key} {...props} />;
  } else if (ComputeBudgetProgram.programId.equals(transactionIx.programId)) {
    return <ComputeBudgetDetailCard key={key} {...props} />;
  } else {
    return <UnknownDetailCard key={key} {...props} />;
  }
}
