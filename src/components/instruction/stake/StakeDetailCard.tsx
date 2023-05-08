import React from "react";
import {
  SignatureResult,
  ParsedTransaction,
  ParsedInstruction,
} from "@bbachain/web3.js";

import { UnknownDetailCard } from "../UnknownDetailCard";
import { InitializeDetailCard } from "./InitializeDetailCard";
import { DelegateDetailCard } from "./DelegateDetailCard";
import { AuthorizeDetailCard } from "./AuthorizeDetailCard";
import { SplitDetailCard } from "./SplitDetailCard";
import { WithdrawDetailCard } from "./WithdrawDetailCard";
import { DeactivateDetailCard } from "./DeactivateDetailCard";
import { ParsedInfo } from "validators";
import { reportError } from "utils/sentry";
import { create } from "superstruct";
import {
  AuthorizeInfo,
  DeactivateInfo,
  DelegateInfo,
  InitializeInfo,
  MergeInfo,
  SplitInfo,
  WithdrawInfo,
} from "./types";
import { MergeDetailCard } from "./MergeDetailCard";

type Props = {
  tx: ParsedTransaction;
  ix: ParsedInstruction;
  result: SignatureResult;
  index: number;
  innerCards?: JSX.Element[];
  childIndex?: number;
};

export function StakeDetailCard(props: Props) {
  try {
    const parsed = create(props.ix.parsed, ParsedInfo);

    switch (parsed.type) {
      case "initialize": {
        const info = create(parsed.info, InitializeInfo);
        return <InitializeDetailCard info={info} {...props} />;
      }
      case "delegate": {
        const info = create(parsed.info, DelegateInfo);
        return <DelegateDetailCard info={info} {...props} />;
      }
      case "authorize": {
        const info = create(parsed.info, AuthorizeInfo);
        return <AuthorizeDetailCard info={info} {...props} />;
      }
      case "split": {
        const info = create(parsed.info, SplitInfo);
        return <SplitDetailCard info={info} {...props} />;
      }
      case "withdraw": {
        const info = create(parsed.info, WithdrawInfo);
        return <WithdrawDetailCard info={info} {...props} />;
      }
      case "deactivate": {
        const info = create(parsed.info, DeactivateInfo);
        return <DeactivateDetailCard info={info} {...props} />;
      }
      case "merge": {
        const info = create(parsed.info, MergeInfo);
        return <MergeDetailCard info={info} {...props} />;
      }
      default:
        return <UnknownDetailCard {...props} />;
    }
  } catch (error) {
    reportError(error, {
      signature: props.tx.signatures[0],
    });
    return <UnknownDetailCard {...props} />;
  }
}
