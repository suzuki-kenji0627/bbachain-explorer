import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster, clusterName } from "hooks/useCluster";
import {
  LatestTransactions,
  LatestTransactionsDispatchContext,
  LatestTransactionsStateContext,
  fetchLatestTransactions,
} from "hooks/useLatestTransactions";

type Props = {
  children: ReactNode;
};

export function LatestTransactionsProvider({ children }: Props) {
  const { url, cluster, clusterInfo } = useCluster();
  const [state, dispatch] = Cache.useReducer<LatestTransactions>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });

    // Auto-fetch latest transactions when provider mounts or URL changes
    if (url && cluster !== undefined) {
      const name = clusterName(cluster);

      fetchLatestTransactions(dispatch, url, name, cluster, 0, 25).catch(() => {
        // Silent error handling
      });
    }
  }, [dispatch, url, cluster, clusterInfo]);

  return (
    <LatestTransactionsStateContext.Provider value={state}>
      <LatestTransactionsDispatchContext.Provider value={dispatch}>
        {children}
      </LatestTransactionsDispatchContext.Provider>
    </LatestTransactionsStateContext.Provider>
  );
}
