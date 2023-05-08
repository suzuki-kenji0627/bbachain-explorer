import React from "react";
import {
  Connection,
  SignatureResult,
  TransactionConfirmationStatus,
  TransactionSignature,
} from "@bbachain/web3.js";

// Hooks
import * as Cache from "hooks/useCache";
import { Cluster, useCluster } from "hooks/useCluster";

// Utils
import { reportError } from "utils/sentry";

export type Confirmations = number | "max";

export type Timestamp = number | "unavailable";

export interface TransactionStatusInfo {
  slot: number;
  result: SignatureResult;
  timestamp: Timestamp;
  confirmations: Confirmations;
  confirmationStatus?: TransactionConfirmationStatus;
}

export interface TransactionStatus {
  signature: TransactionSignature;
  info: TransactionStatusInfo | null;
}

type TransactionState = Cache.State<TransactionStatus>;
type TransactionDispatch = Cache.Dispatch<TransactionStatus>;

export const TransactionStateContext = React.createContext<TransactionState | undefined>(undefined);
export const TransactionDispatchContext = React.createContext<TransactionDispatch | undefined>(undefined);

export async function fetchTransaction(
  dispatch: TransactionDispatch,
  signature: TransactionSignature,
  cluster: Cluster,
  url: string
) {
  dispatch({
    type: Cache.ActionType.Update,
    key: signature,
    status: Cache.FetchStatus.Fetching,
    url,
  });

  let fetchStatus;
  let data;
  try {
    const connection = new Connection(url);
    const { value } = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    });

    let info = null;
    if (value !== null) {
      let confirmations: Confirmations;
      if (typeof value.confirmations === "number") {
        confirmations = value.confirmations;
      } else {
        confirmations = "max";
      }

      let blockTime = null;
      try {
        blockTime = await connection.getBlockTime(value.slot);
      } catch (error) {
        if (cluster === Cluster.Mainnet && confirmations === "max") {
          reportError(error, { slot: `${value.slot}` });
        }
      }
      let timestamp: Timestamp = blockTime !== null ? blockTime : "unavailable";

      info = {
        slot: value.slot,
        timestamp,
        confirmations,
        confirmationStatus: value.confirmationStatus,
        result: { err: value.err },
      };
    }
    data = { signature, info };
    fetchStatus = Cache.FetchStatus.Fetched;
  } catch (error) {
    if (cluster !== Cluster.Custom) {
      reportError(error, { url });
    }
    fetchStatus = Cache.FetchStatus.FetchFailed;
  }

  dispatch({
    type: Cache.ActionType.Update,
    key: signature,
    status: fetchStatus,
    data,
    url,
  });
}

export function useTransaction(
  signature: TransactionSignature | undefined
): Cache.CacheEntry<TransactionStatus> | undefined {
  const context = React.useContext(TransactionStateContext);

  if (!context) {
    throw new Error(
      `useTransaction must be used within a TransactionProvider`
    );
  }

  if (signature === undefined) {
    return undefined;
  }

  return context.entries[signature];
}

export function useFetchTransaction() {
  const dispatch = React.useContext(TransactionDispatchContext);
  if (!dispatch) {
    throw new Error(
      `useFetchTransaction must be used within a TransactionProvider`
    );
  }

  const { cluster, url } = useCluster();
  return React.useCallback(
    (signature: TransactionSignature) => {
      fetchTransaction(dispatch, signature, cluster, url);
    },
    [dispatch, cluster, url]
  );
}
