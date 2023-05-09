import React from "react";

// Hooks
import * as Cache from "hooks/useCache";
import { useCluster } from "hooks/useCluster";
import {
  Epoch,
  EpochDispatchContext,
  EpochStateContext
} from "hooks/useEpoch";

type Props = { children: React.ReactNode };

export function EpochProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<Epoch>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <EpochStateContext.Provider value={state}>
      <EpochDispatchContext.Provider value={dispatch}>
        {children}
      </EpochDispatchContext.Provider>
    </EpochStateContext.Provider>
  );
}
