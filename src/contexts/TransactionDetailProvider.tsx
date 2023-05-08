import { useCluster } from "hooks/useCluster";
import React from "react";

// Hooks
import * as Cache from "hooks/useCache";
import {
  TransactionDetail,
  TransactionDetailDispatchContext,
  TransactionDetailStateContext
} from "hooks/useTransactionDetail";

type Props = { children: React.ReactNode };
export function TransactionDetailProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<TransactionDetail>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <TransactionDetailStateContext.Provider value={state}>
      <TransactionDetailDispatchContext.Provider value={dispatch}>
        {children}
      </TransactionDetailDispatchContext.Provider>
    </TransactionDetailStateContext.Provider>
  );
}
