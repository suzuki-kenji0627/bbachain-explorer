import React from "react";
import {
  Connection,
  ParsedTransactionWithMeta,
  TransactionSignature
} from "@bbachain/web3.js";

// Hooks
import * as Cache from "hooks/useCache";
import { Cluster, useCluster } from "./useCluster";

// Utils
import { reportError } from "utils/sentry";

export interface TransactionDetail {
  transactionWithMeta?: ParsedTransactionWithMeta | null;
}

type TransactionDetailState = Cache.State<TransactionDetail>;
type TransactionDetailDispatch = Cache.Dispatch<TransactionDetail>;

export const TransactionDetailStateContext = React.createContext<TransactionDetailState | undefined>(undefined);
export const TransactionDetailDispatchContext = React.createContext<TransactionDetailDispatch | undefined>(undefined);

async function fetchDetail(
  dispatch: TransactionDetailDispatch,
  signature: TransactionSignature,
  cluster: Cluster,
  url: string
) {
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: signature,
    url,
  });

  let fetchStatus;
  let transactionWithMeta;
  try {
    transactionWithMeta = await new Connection(url).getParsedTransaction(
      signature,
      { commitment: "confirmed", maxSupportedTransactionVersion: 0 }
    );
    fetchStatus = Cache.FetchStatus.Fetched;
  } catch (error) {
    if (cluster !== Cluster.Custom) {
      reportError(error, { url });
    }
    fetchStatus = Cache.FetchStatus.FetchFailed;
  }
  dispatch({
    type: Cache.ActionType.Update,
    status: fetchStatus,
    key: signature,
    data: { transactionWithMeta },
    url,
  });
}

export function useTransactionDetail(
  signature: TransactionSignature
): Cache.CacheEntry<TransactionDetail> | undefined {
  const context = React.useContext(TransactionDetailStateContext);

  if (!context) {
    throw new Error(
      `useTransactionDetail must be used within a TransactionProvider`
    );
  }

  return context.entries[signature];
}

export function useFetchTransactionDetail() {
  const dispatch = React.useContext(TransactionDetailDispatchContext);
  if (!dispatch) {
    throw new Error(
      `useFetchTransactionDetail must be used within a TransactionProvider`
    );
  }

  const { cluster, url } = useCluster();
  return React.useCallback(
    (signature: TransactionSignature) => {
      url && fetchDetail(dispatch, signature, cluster, url);
    },
    [dispatch, cluster, url]
  );
}
