import React from "react";

// Hooks
import * as Cache from "hooks/useCache";
import { useCluster } from "hooks/useCluster";
import {
  TransactionDispatchContext,
  TransactionStateContext,
  TransactionStatus
} from "hooks/useTransaction";
import { TransactionDetailProvider } from "./TransactionDetailProvider";
import { TransactionDetailRawProvider } from "./TransactionDetailRawProvider";

type Props = { children: React.ReactNode };
export function TransactionProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<TransactionStatus>(url);

  // Clear accounts cache whenever cluster is changed
  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <TransactionStateContext.Provider value={state}>
      <TransactionDispatchContext.Provider value={dispatch}>
        <TransactionDetailProvider>
          <TransactionDetailRawProvider>
            {children}
          </TransactionDetailRawProvider>
        </TransactionDetailProvider>
      </TransactionDispatchContext.Provider>
    </TransactionStateContext.Provider>
  );
}