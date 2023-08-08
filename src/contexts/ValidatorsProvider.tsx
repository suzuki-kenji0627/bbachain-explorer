import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster } from "hooks/useCluster";
import {
  ValidatorsDispatchContext,
  ValidatorsStateContext,
} from "hooks/useValidators";
import { VoteAccountInfo } from "@bbachain/web3.js";

type Props = {
  children: ReactNode;
};

export function ValidatorsProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<VoteAccountInfo[]>(url);

  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
  }, [dispatch, url]);

  return (
    <ValidatorsStateContext.Provider value={state}>
      <ValidatorsDispatchContext.Provider value={dispatch}>
        {children}
      </ValidatorsDispatchContext.Provider>
    </ValidatorsStateContext.Provider>
  );
}
