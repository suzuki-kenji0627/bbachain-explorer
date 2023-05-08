import { useCluster } from "hooks/useCluster";
import React from "react";

// Hooks
import * as Cache from "hooks/useCache";
import {
  TransactionDetailRaw,
  TransactionDetailRawDispatchContext,
  TransactionDetailRawStateContext
} from "hooks/useTransactionDetailRaw";

type Props = { children: React.ReactNode };

export function TransactionDetailRawProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<TransactionDetailRaw>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <TransactionDetailRawStateContext.Provider value={state}>
      <TransactionDetailRawDispatchContext.Provider value={dispatch}>
        {children}
      </TransactionDetailRawDispatchContext.Provider>
    </TransactionDetailRawStateContext.Provider>
  );
}
