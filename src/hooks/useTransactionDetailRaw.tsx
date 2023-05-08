import React from "react";
import {
  Connection,
  DecompileArgs,
  TransactionMessage,
  TransactionSignature,
  VersionedMessage
} from "@bbachain/web3.js";

// Hooks
import * as Cache from "hooks/useCache";
import { Cluster, useCluster } from "./useCluster";

// Utils
import { reportError } from "utils/sentry";

export interface TransactionDetailRaw {
  raw?: {
    transaction: TransactionMessage;
    message: VersionedMessage;
    signatures: string[];
  } | null;
}

type TransactionDetailRawState = Cache.State<TransactionDetailRaw>;
type TransactionDetailRawDispatch = Cache.Dispatch<TransactionDetailRaw>;

export const TransactionDetailRawStateContext = React.createContext<TransactionDetailRawState | undefined>(undefined);
export const TransactionDetailRawDispatchContext = React.createContext<TransactionDetailRawDispatch | undefined>(undefined);

async function fetchTransactionDetailRaw(
  dispatch: TransactionDetailRawDispatch,
  signature: TransactionSignature,
  cluster: Cluster,
  url: string
) {
  let fetchStatus: Cache.FetchStatus;
  try {
    const response = await new Connection(url).getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    fetchStatus = Cache.FetchStatus.Fetched;

    let data: TransactionDetailRaw = { raw: null };
    if (response !== null) {
      const { message, signatures } = response.transaction;
      const accountKeysFromLookups = response.meta?.loadedAddresses;
      const decompileArgs: DecompileArgs | undefined =
        accountKeysFromLookups && { accountKeysFromLookups };
      data = {
        raw: {
          message,
          signatures,
          transaction: TransactionMessage.decompile(message, decompileArgs),
        },
      };
    }

    dispatch({
      type: Cache.ActionType.Update,
      status: fetchStatus,
      key: signature,
      data,
      url,
    });
  } catch (error) {
    if (cluster !== Cluster.Custom) {
      reportError(error, { url });
    }
  }
}

export function useTransactionDetailRaw(
  signature: TransactionSignature
): Cache.CacheEntry<TransactionDetailRaw> | undefined {
  const context = React.useContext(TransactionDetailRawStateContext);

  if (!context) {
    throw new Error(
      `useTransactionDetailRaw must be used within a TransactionProvider`
    );
  }

  return context.entries[signature];
}

export function useFetchTransactionDetailRaw() {
  const dispatch = React.useContext(TransactionDetailRawDispatchContext);
  if (!dispatch) {
    throw new Error(
      `useFetchTransactionDetailRaw must be used within a TransactionProvider`
    );
  }

  const { cluster, url } = useCluster();
  return React.useCallback(
    (signature: TransactionSignature) => {
      url && fetchTransactionDetailRaw(dispatch, signature, cluster, url);
    },
    [dispatch, cluster, url]
  );
}
