import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster } from "hooks/useCluster";
import {
  LatestBlocks,
  LatestBlocksDispatchContext,
  LatestBlocksStateContext,
  fetchLatestBlocks,
} from "hooks/useLatestBlocks";

type Props = {
  children: ReactNode;
};

export function LatestBlocksProvider({ children }: Props) {
  const { url, cluster } = useCluster();
  const [state, dispatch] = Cache.useReducer<LatestBlocks>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });

    // Auto-fetch latest blocks when provider mounts or URL changes
    if (url && cluster !== undefined) {
      fetchLatestBlocks(dispatch, url, cluster, 0).catch(() => {
        // Silent error handling
      });
    }
  }, [dispatch, url, cluster]);

  return (
    <LatestBlocksStateContext.Provider value={state}>
      <LatestBlocksDispatchContext.Provider value={dispatch}>
        {children}
      </LatestBlocksDispatchContext.Provider>
    </LatestBlocksStateContext.Provider>
  );
}
