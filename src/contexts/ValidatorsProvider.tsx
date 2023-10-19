import React, { ReactNode } from "react";
import * as Cache from "../hooks/useCache";

// Hooks
import { useCluster } from "hooks/useCluster";
import {
  Validators,
  ValidatorsDispatchContext,
  ValidatorsStateContext,
} from "hooks/useValidators";

type Props = {
  children: ReactNode;
};

export function ValidatorsProvider({ children }: Props) {
  const { url } = useCluster();
  const [state, dispatch] = Cache.useReducer<Validators>(url);

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
