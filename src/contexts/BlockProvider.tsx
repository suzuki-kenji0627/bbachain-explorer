import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster } from "hooks/useCluster";
import { Block, BlockDispatchContext, BlockStateContext } from "hooks/useBlock";

type Props = {
  children: ReactNode;
};

export function BlockProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<Block>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <BlockStateContext.Provider value={state}>
      <BlockDispatchContext.Provider value={dispatch}>
        {children}
      </BlockDispatchContext.Provider>
    </BlockStateContext.Provider>
  );
}