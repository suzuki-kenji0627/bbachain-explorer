import { Dispatch, createContext, useCallback, useContext } from "react";
import { Connection, PublicKey } from "@bbachain/web3.js";
import { Cluster, useCluster } from "./useCluster";
import { reportError } from "utils/sentry";

export interface TopAccount {
  address: PublicKey;
  daltons: number;
}

export enum TopAccountStatus {
  Idle,
  Disconnected,
  Connecting,
}

export type TopAccountState = TopAccount[] | TopAccountStatus | string;
export type TopAccountDispatch = Dispatch<
  React.SetStateAction<TopAccountState>
>;
export const TopAccountStateContext = createContext<
  TopAccountState | undefined
>(undefined);
export const TopAccountDispatchContext = createContext<
  TopAccountDispatch | undefined
>(undefined);

export async function fetch(
  dispatch: TopAccountDispatch,
  cluster: Cluster,
  url: string
) {
  dispatch(TopAccountStatus.Connecting);

  try {
    const connection = new Connection(url, "finalized");
    const topAccount = (
      await connection.getLargestAccounts({
        commitment: "finalized",
        filter: "circulating",
      })
    ).value;

    // Update state if still connecting
    dispatch((state) => {
      if (state !== TopAccountStatus.Connecting) return state;

      return topAccount;
    });
  } catch (err) {
    if (cluster !== Cluster.Custom) {
      reportError(err, { url });
    }
    dispatch("Failed to fetch top accounts");
  }
}

export function useTopAccount() {
  const state = useContext(TopAccountStateContext);
  if (state === undefined) {
    throw new Error(`useTopAccount must be used within a TopAccountProvider`);
  }
  return state;
}

export function useFetchTopAccount() {
  const dispatch = useContext(TopAccountDispatchContext);
  if (!dispatch) {
    throw new Error(
      `useFetchTopAccount must be used within a TopAccountProvider`
    );
  }

  const { cluster, url } = useCluster();
  return useCallback(() => {
    fetch(dispatch, cluster, url);
  }, [dispatch, cluster, url]);
}
