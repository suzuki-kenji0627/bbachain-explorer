import React from "react";

// Contexts
import { HistoryProvider } from "./HistoryProvider";

// Hooks
import * as Cache from "hooks/useCache";
import { useCluster } from "hooks/useCluster";
import {
  Address,
  AddressDispatchContext,
  AddressFetchers,
  AddressFetchersContext,
  AddressStateContext,
  MultipleAccountFetcher
} from "hooks/useAddress";

type Props = { children: React.ReactNode };

export function AddressProvider({ children }: Props) {
  const { cluster, url } = useCluster();
  const [state, dispatch] = Cache.useReducer<Address>(url);
  const [fetchers, setFetchers] = React.useState<AddressFetchers>(() => ({
    skip: new MultipleAccountFetcher(dispatch, cluster, url, "skip"),
    raw: new MultipleAccountFetcher(dispatch, cluster, url, "raw"),
    parsed: new MultipleAccountFetcher(dispatch, cluster, url, "parsed"),
  }));

  // Clear accounts cache whenever cluster is changed
  React.useEffect(() => {
    dispatch({ type: Cache.ActionType.Clear, url });
    setFetchers({
      skip: new MultipleAccountFetcher(dispatch, cluster, url, "skip"),
      raw: new MultipleAccountFetcher(dispatch, cluster, url, "raw"),
      parsed: new MultipleAccountFetcher(dispatch, cluster, url, "parsed"),
    });
  }, [dispatch, cluster, url]);

  return (
    <AddressStateContext.Provider value={state}>
      <AddressDispatchContext.Provider value={dispatch}>
        <AddressFetchersContext.Provider value={fetchers}>
          {/* <TokensProvider> */}
            <HistoryProvider>
              {/* <RewardsProvider> */}
                {children}
              {/* </RewardsProvider> */}
            </HistoryProvider>
          {/* </TokensProvider> */}
        </AddressFetchersContext.Provider>
      </AddressDispatchContext.Provider>
    </AddressStateContext.Provider>
  );
}