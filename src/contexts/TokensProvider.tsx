import React, { useEffect } from "react";
import { useCluster } from "hooks/useCluster";
import * as Cache from "hooks/useCache";
import {
  TokensData,
  TokensStateContext,
  TokensDispatchContext,
  fetchTokens,
} from "hooks/useTokens";

type Props = { children: React.ReactNode };

export function TokensProvider({ children }: Props) {
  const { url, cluster } = useCluster();
  const [state, dispatch] = Cache.useReducer<TokensData>(url);

  useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });

    // Auto-fetch tokens when provider mounts or URL changes
    if (url && cluster !== undefined) {
      fetchTokens(dispatch, url, cluster, 20).catch(() => {
        // Silent error handling
      });
    }
  }, [dispatch, url, cluster]);

  return (
    <TokensStateContext.Provider value={state}>
      <TokensDispatchContext.Provider value={dispatch}>
        {children}
      </TokensDispatchContext.Provider>
    </TokensStateContext.Provider>
  );
}
