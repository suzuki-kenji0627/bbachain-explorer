import React from "react";
import * as Sentry from "@sentry/react";
import { Connection, PublicKey, VoteAccountInfo } from "@bbachain/web3.js";

// Hooks
import * as Cache from "./useCache";
import { Cluster, useCluster } from "./useCluster";

type State = Cache.State<VoteAccountInfo[]>;
type Dispatch = Cache.Dispatch<VoteAccountInfo[]>;

export const ValidatorsStateContext = React.createContext<State | undefined>(
  undefined
);
export const ValidatorsDispatchContext = React.createContext<
  Dispatch | undefined
>(undefined);

export async function fetchValidators(
  dispatch: Dispatch,
  url: string,
  cluster: Cluster
) {
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: "validators",
    url,
  });

  let status: Cache.FetchStatus;
  let data: VoteAccountInfo[] | undefined = undefined;

  try {
    const connection = new Connection(url, "confirmed");
    const validators = await connection.getVoteAccounts();

    data = validators.current;
    dispatch({
      type: Cache.ActionType.Update,
      url,
      key: "validators",
      status: Cache.FetchStatus.Fetched,
      data,
    });
  } catch (err) {
    status = Cache.FetchStatus.FetchFailed;
    if (cluster !== Cluster.Custom) {
      Sentry.captureException(err, { tags: { url } });
    }
    dispatch({
      type: Cache.ActionType.Update,
      url,
      key: "validators",
      status,
      data,
    });
  }
}

export function useValidators():
  | Cache.CacheEntry<VoteAccountInfo[]>
  | undefined {
  const context = React.useContext(ValidatorsStateContext);

  if (!context) {
    throw new Error(`useValidators must be used within a ValidatorsProvider`);
  }

  return context.entries["validators"];
}

export function useFetchValidators() {
  const dispatch = React.useContext(ValidatorsDispatchContext);
  if (!dispatch) {
    throw new Error(
      `useFetchValidators must be used within a ValidatorsProvider`
    );
  }

  const { cluster, url } = useCluster();
  return React.useCallback(
    () => fetchValidators(dispatch, url, cluster),
    [dispatch, cluster, url]
  );
}
