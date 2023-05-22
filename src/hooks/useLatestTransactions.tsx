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
import { Cluster, useCluster } from "./useCluster";

let MAX_PAGINATION_PAGE = 25;

type TxExtension = {
  confirmations?: SignatureStatus;
  signature: string;
};

type ParsedTransactionWithMetaExtended = ParsedTransactionWithMeta &
  TxExtension;

export type LatestTransactions = {
  transactions?: ParsedTransactionWithMetaExtended[];
  nextEndSlot?: number;
  nextEndTx?: number;
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
  cluster: Cluster,
  nextEndSlot: number,
  nextEndTx: number,
  pageSize?: number
) {
  MAX_PAGINATION_PAGE = pageSize || 25;
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: "transactions",
    url,
  });

  let status: Cache.FetchStatus;
  let data: LatestTransactions | undefined = undefined;
  const transactions: ParsedTransactionWithMetaExtended[] = [];
  const tx = Number(nextEndTx) || 0;

  try {
    const connection = new Connection(url, "confirmed");
    let blockNumber = nextEndSlot || (await connection.getBlockHeight());
    let txNumber = tx;
    while (true) {
      const block = await connection.getBlockSignatures(blockNumber);
      for (let i = 0; i < block.signatures.length; i++) {
        if (i < tx) {
          txNumber = 0;
          continue;
        }
        const transaction = await connection.getParsedTransaction(
          block.signatures[i]
        );
        const { value } = await connection.getSignatureStatus(
          block.signatures[i]
        );
        transactions.push({
          ...transaction,
          ...{ confirmations: value, signature: block.signatures[i] },
        });

        txNumber = txNumber + 1 < block.signatures.length ? txNumber + 1 : 0;
        if (transactions.length === MAX_PAGINATION_PAGE) {
          blockNumber = txNumber === 0 ? blockNumber - 1 : blockNumber;
          break;
        }
      }
      if (transactions.length === MAX_PAGINATION_PAGE) {
        break;
      }
      blockNumber = blockNumber - 1;
    }

    data = {
      transactions: transactions,
      nextEndSlot: blockNumber,
      nextEndTx: txNumber,
    };
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
  return React.useCallback(
    (nextEndSlot: number, nextEndTx: number, pageSize?: number) =>
      fetchLatestTransactions(
        dispatch,
        url,
        cluster,
        nextEndSlot,
        nextEndTx,
        pageSize
      ),
    [dispatch, cluster, url]
  );
}
