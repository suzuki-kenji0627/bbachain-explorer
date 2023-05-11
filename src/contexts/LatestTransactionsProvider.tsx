import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster } from "hooks/useCluster";
import {
  LatestTransactions,
  LatestTransactionsDispatchContext,
  LatestTransactionsStateContext,
} from "hooks/useLatestTransactions";

type Props = {
  children: ReactNode;
};

export function LatestTransactionsProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<LatestTransactions>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <LatestTransactionsStateContext.Provider value={state}>
      <LatestTransactionsDispatchContext.Provider value={dispatch}>
        {children}
      </LatestTransactionsDispatchContext.Provider>
    </LatestTransactionsStateContext.Provider>
  );
}
