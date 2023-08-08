import React from "react";
import {
  ConfirmedSignatureInfo,
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
  TransactionSignature,
} from "@bbachain/web3.js";

// Hooks
import * as Cache from "./useCache";
import { Cluster, useCluster } from "./useCluster";

// Utils
import { reportError } from "utils/sentry";

const MAX_TRANSACTION_BATCH_SIZE = 10;

type TransactionMap = Map<string, ParsedTransactionWithMeta>;

export type AddressHistory = {
  fetched: ConfirmedSignatureInfo[];
  transactionMap?: TransactionMap;
  foundOldest: boolean;
};

export type HistoryUpdate = {
  history?: AddressHistory;
  transactionMap?: TransactionMap;
  before?: TransactionSignature;
};

type AddressState = Cache.State<AddressHistory>;
type AddressDispatch = Cache.Dispatch<HistoryUpdate>;

export const AddressStateContext = React.createContext<
  AddressState | undefined
>(undefined);
export const AddressDispatchContext = React.createContext<
  AddressDispatch | undefined
>(undefined);

export function useAddressHistory(
  address: string
): Cache.CacheEntry<AddressHistory> | undefined {
  const context = React.useContext(AddressStateContext);

  if (!context) {
    throw new Error(`useAddressHistory must be used within a AddressProvider`);
  }

  return context.entries[address];
}

export function useFetchAddressHistory() {
  const { cluster, url } = useCluster();
  const state = React.useContext(AddressStateContext);
  const dispatch = React.useContext(AddressDispatchContext);

  if (!state || !dispatch) {
    throw new Error(
      `useFetchAddressHistory must be used within a AddressProvider`
    );
  }

  return React.useCallback(
    (pubkey: PublicKey, fetchTransactions?: boolean, refresh?: boolean) => {
      const before = state.entries[pubkey.toBase58()];
      if (!refresh && before?.data?.fetched && before.data.fetched.length > 0) {
        if (before.data.foundOldest) return;

        let additionalSignatures: string[] = [];
        if (fetchTransactions) {
          additionalSignatures = getUnfetchedSignatures(before);
        }

        const oldest =
          before.data.fetched[before.data.fetched.length - 1].signature;
        fetchAccountHistory(
          dispatch,
          pubkey,
          cluster,
          url,
          {
            before: oldest,
            limit: 25,
          },
          fetchTransactions,
          additionalSignatures
        );
      } else {
        fetchAccountHistory(
          dispatch,
          pubkey,
          cluster,
          url,
          { limit: 25 },
          fetchTransactions
        );
      }
    },
    [state, dispatch, cluster, url]
  );
}

function getUnfetchedSignatures(before: Cache.CacheEntry<AddressHistory>) {
  if (!before.data?.transactionMap) {
    return [];
  }

  const existingMap = before.data.transactionMap;
  const allSignatures = before.data.fetched.map(
    (signatureInfo) => signatureInfo.signature
  );
  return allSignatures.filter((signature) => !existingMap.has(signature));
}

async function fetchAccountHistory(
  dispatch: AddressDispatch,
  pubkey: PublicKey,
  cluster: Cluster,
  url: string,
  options: {
    before?: TransactionSignature;
    limit: number;
  },
  fetchTransactions?: boolean,
  additionalSignatures?: string[]
) {
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: pubkey.toBase58(),
    url,
  });

  let status;
  let history;
  try {
    const connection = new Connection(url);
    const fetched = await connection.getConfirmedSignaturesForAddress2(
      pubkey,
      options
    );
    history = {
      fetched,
      foundOldest: fetched.length < options.limit,
    };
    status = Cache.FetchStatus.Fetched;
  } catch (error) {
    if (cluster !== Cluster.Custom) {
      reportError(error, { url });
    }
    status = Cache.FetchStatus.FetchFailed;
  }

  let transactionMap;
  if (fetchTransactions && history?.fetched) {
    try {
      const signatures = history.fetched
        .map((signature) => signature.signature)
        .concat(additionalSignatures || []);
      transactionMap = await fetchParsedTransactions(url, signatures);
    } catch (error) {
      if (cluster !== Cluster.Custom) {
        reportError(error, { url });
      }
      status = Cache.FetchStatus.FetchFailed;
    }
  }

  dispatch({
    type: Cache.ActionType.Update,
    url,
    key: pubkey.toBase58(),
    status,
    data: {
      history,
      transactionMap,
      before: options?.before,
    },
  });
}

async function fetchParsedTransactions(
  url: string,
  transactionSignatures: string[]
) {
  const transactionMap = new Map();
  const connection = new Connection(url);

  while (transactionSignatures.length > 0) {
    const signatures = transactionSignatures.splice(
      0,
      MAX_TRANSACTION_BATCH_SIZE
    );
    const fetched = await connection.getParsedTransactions(signatures, {
      maxSupportedTransactionVersion: 0,
    });
    fetched.forEach(
      (
        transactionWithMeta: ParsedTransactionWithMeta | null,
        index: number
      ) => {
        if (transactionWithMeta !== null) {
          transactionMap.set(signatures[index], transactionWithMeta);
        }
      }
    );
  }

  return transactionMap;
}
