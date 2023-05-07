import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster } from "hooks/useCluster";
import { Block, BlockchainDispatchContext, BlockchainStateContext } from "hooks/useBlockchain";

type Props = {
  children: ReactNode;
};

export function BlockchainProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<Block>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <BlockchainStateContext.Provider value={state}>
      <BlockchainDispatchContext.Provider value={dispatch}>
        {children}
      </BlockchainDispatchContext.Provider>
    </BlockchainStateContext.Provider>
  );
}