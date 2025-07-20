import React from "react";
import * as Sentry from "@sentry/react";
import {
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
  SignatureStatus,
} from "@bbachain/web3.js";

// Hooks
import * as Cache from "./useCache";
import { Cluster, useCluster, clusterName } from "./useCluster";

type TxExtension = {
  confirmations?: SignatureStatus;
  signature: string;
  signer: string;
};

type ParsedTransactionWithMetaExtended = ParsedTransactionWithMeta &
  TxExtension;

export type LatestTransactions = {
  transactions?: ParsedTransactionWithMetaExtended[];
  nextPage: number;
};

type State = Cache.State<LatestTransactions>;
type Dispatch = Cache.Dispatch<LatestTransactions>;

export const LatestTransactionsStateContext = React.createContext<
  State | undefined
>(undefined);
export const LatestTransactionsDispatchContext = React.createContext<
  Dispatch | undefined
>(undefined);

export async function fetchLatestTransactions(
  dispatch: Dispatch,
  url: string,
  name: string,
  cluster: Cluster,
  page: number,
  pageSize: number
) {
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: "transactions",
    url,
  });

  let status: Cache.FetchStatus;
  let data: LatestTransactions | undefined = undefined;

  try {
    const apiUrl = `/api/latest_transactions?page=${page || 0}&docs=${
      pageSize || 25
    }&name=${name}&url=${url}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const transactions = result.transactionResponse || [];

    data = {
      transactions: transactions,
      nextPage: page + 1,
    };

    status = Cache.FetchStatus.Fetched;

    // Optional: trigger background update
    fetch(`/api/latest_transactions?name=${name}&url=${url}`, {
      method: "post",
    }).catch(() => {}); // Ignore errors for background update
  } catch (err) {
    status = Cache.FetchStatus.FetchFailed;
    if (cluster !== Cluster.Custom) {
      Sentry.captureException(err, { tags: { url } });
    }
  }

  dispatch({
    type: Cache.ActionType.Update,
    url,
    key: "transactions",
    status,
    data,
  });
}

export function useLatestTransactions():
  | Cache.CacheEntry<LatestTransactions>
  | undefined {
  const context = React.useContext(LatestTransactionsStateContext);

  if (!context) {
    throw new Error(
      `useLatestTransactions must be used within a LatestTransactionsProvider`
    );
  }

  return context.entries["transactions"];
}

export function useFetchLatestTransactions() {
  const dispatch = React.useContext(LatestTransactionsDispatchContext);
  if (!dispatch) {
    throw new Error(
      `useFetchLatestTransactions must be used within a LatestTransactionsProvider`
    );
  }

  const { cluster, url } = useCluster();
  const name = clusterName(cluster);
  return React.useCallback(
    (page: number, pageSize: number) =>
      fetchLatestTransactions(dispatch, url, name, cluster, page, pageSize),
    [dispatch, cluster, url, name]
  );
}
