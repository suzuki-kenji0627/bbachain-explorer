import React from "react";
import {
  SignatureResult,
  ParsedInstruction,
  ParsedTransaction,
} from "@bbachain/web3.js";

import { UnknownDetailCard } from "../UnknownDetailCard";
import { TransferDetailCard } from "./TransferDetailCard";
import { AllocateDetailCard } from "./AllocateDetailCard";
import { AllocateWithSeedDetailCard } from "./AllocateWithSeedDetailCard";
import { AssignDetailCard } from "./AssignDetailCard";
import { AssignWithSeedDetailCard } from "./AssignWithSeedDetailCard";
import { CreateDetailCard } from "./CreateDetailCard";
import { CreateWithSeedDetailCard } from "./CreateWithSeedDetailCard";
import { NonceInitializeDetailCard } from "./NonceInitializeDetailCard";
import { NonceAdvanceDetailCard } from "./NonceAdvanceDetailCard";
import { NonceWithdrawDetailCard } from "./NonceWithdrawDetailCard";
import { NonceAuthorizeDetailCard } from "./NonceAuthorizeDetailCard";
import { TransferWithSeedDetailCard } from "./TransferWithSeedDetailCard";
import { UpgradeNonceDetailCard } from "./UpgradeNonceDetailCard";
import { ParsedInfo } from "validators";
import { create } from "superstruct";
import { reportError } from "utils/sentry";
import {
  CreateAccountInfo,
  CreateAccountWithSeedInfo,
  AllocateInfo,
  AllocateWithSeedInfo,
  AssignInfo,
  AssignWithSeedInfo,
  TransferInfo,
  AdvanceNonceInfo,
  AuthorizeNonceInfo,
  InitializeNonceInfo,
  WithdrawNonceInfo,
  TransferWithSeedInfo,
  UpgradeNonceInfo,
} from "./types";

type Props = {
  tx: ParsedTransaction;
  ix: ParsedInstruction;
  result: SignatureResult;
  index: number;
  innerCards?: JSX.Element[];
  childIndex?: number;
};

export function SystemDetailCard(props: Props) {
  try {
    const parsed = create(props.ix.parsed, ParsedInfo);
    switch (parsed.type) {
      case "createAccount": {
        const info = create(parsed.info, CreateAccountInfo);
        return <CreateDetailCard info={info} {...props} />;
      }
      case "createAccountWithSeed": {
        const info = create(parsed.info, CreateAccountWithSeedInfo);
        return <CreateWithSeedDetailCard info={info} {...props} />;
      }
      case "allocate": {
        const info = create(parsed.info, AllocateInfo);
        return <AllocateDetailCard info={info} {...props} />;
      }
      case "allocateWithSeed": {
        const info = create(parsed.info, AllocateWithSeedInfo);
        return <AllocateWithSeedDetailCard info={info} {...props} />;
      }
      case "assign": {
        const info = create(parsed.info, AssignInfo);
        return <AssignDetailCard info={info} {...props} />;
      }
      case "assignWithSeed": {
        const info = create(parsed.info, AssignWithSeedInfo);
        return <AssignWithSeedDetailCard info={info} {...props} />;
      }
      case "transfer": {
        const info = create(parsed.info, TransferInfo);
        return <TransferDetailCard info={info} {...props} />;
      }
      case "advanceNonce": {
        const info = create(parsed.info, AdvanceNonceInfo);
        return <NonceAdvanceDetailCard info={info} {...props} />;
      }
      case "withdrawNonce": {
        const info = create(parsed.info, WithdrawNonceInfo);
        return <NonceWithdrawDetailCard info={info} {...props} />;
      }
      case "authorizeNonce": {
        const info = create(parsed.info, AuthorizeNonceInfo);
        return <NonceAuthorizeDetailCard info={info} {...props} />;
      }
      case "initializeNonce": {
        const info = create(parsed.info, InitializeNonceInfo);
        return <NonceInitializeDetailCard info={info} {...props} />;
      }
      case "transferWithSeed": {
        const info = create(parsed.info, TransferWithSeedInfo);
        return <TransferWithSeedDetailCard info={info} {...props} />;
      }
      case "upgradeNonce": {
        const info = create(parsed.info, UpgradeNonceInfo);
        return <UpgradeNonceDetailCard info={info} {...props} />;
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
