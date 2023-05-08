import React from "react";
import {
  ConfirmedSignatureInfo,
  TransactionSignature
} from "@bbachain/web3.js";

// Hooks
import * as Cache from "hooks/useCache";
import { useCluster } from "hooks/useCluster";
import {
  AddressDispatchContext,
  AddressHistory,
  AddressStateContext,
  HistoryUpdate
} from "hooks/useAddressHistory";

function combineFetched(
  fetched: ConfirmedSignatureInfo[],
  current: ConfirmedSignatureInfo[] | undefined,
  before: TransactionSignature | undefined
) {
  if (current === undefined || current.length === 0) {
    return fetched;
  }

  // History was refreshed, fetch results should be prepended if contiguous
  if (before === undefined) {
    const end = fetched.findIndex((f) => f.signature === current[0].signature);
    if (end < 0) return fetched;
    return fetched.slice(0, end).concat(current);
  }

  // More history was loaded, fetch results should be appended
  if (current[current.length - 1].signature === before) {
    return current.concat(fetched);
  }

  return fetched;
}

function reconcile(
    history: AddressHistory | undefined,
    update: HistoryUpdate | undefined
  ) {
    if (update?.history === undefined) return history;

    let transactionMap = history?.transactionMap || new Map();
    if (update.transactionMap) {
      transactionMap = new Map([...transactionMap, ...update.transactionMap]);
    }

    return {
      fetched: combineFetched(
        update.history.fetched,
        history?.fetched,
        update?.before
      ),
      transactionMap,
      foundOldest: update?.history?.foundOldest || history?.foundOldest || false,
    };
  }

type Props = { children: React.ReactNode };

export function HistoryProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useCustomReducer(url, reconcile);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <AddressStateContext.Provider value={state}>
      <AddressDispatchContext.Provider value={dispatch}>
        {children}
      </AddressDispatchContext.Provider>
    </AddressStateContext.Provider>
  );
}