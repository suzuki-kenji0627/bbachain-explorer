import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster } from "hooks/useCluster";
import {
  LatestBlocks,
  LatestBlocksDispatchContext,
  LatestBlocksStateContext
} from "hooks/useLatestBlocks";

type Props = {
  children: ReactNode;
};

export function LatestBlocksProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<LatestBlocks>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <LatestBlocksStateContext.Provider value={state}>
      <LatestBlocksDispatchContext.Provider value={dispatch}>
        {children}
      </LatestBlocksDispatchContext.Provider>
    </LatestBlocksStateContext.Provider>
  );
}