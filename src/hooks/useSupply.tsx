import { Dispatch, createContext, useCallback, useContext } from "react";
import { BBA_DALTON_UNIT, Connection, Supply } from "@bbachain/web3.js";
import { Cluster, useCluster } from "./useCluster";
import { reportError } from "utils/sentry";

const HIDDEN_BALANCE = 1_000_000 * BBA_DALTON_UNIT;

export enum SupplyStatus {
  Idle,
  Disconnected,
  Connecting,
}

export type SupplyState = Supply | SupplyStatus | string;
export type SupplyDispatch = Dispatch<React.SetStateAction<SupplyState>>;
export const SupplyStateContext = createContext<SupplyState | undefined>(undefined);
export const SupplyDispatchContext = createContext<SupplyDispatch | undefined>(undefined);

export async function fetch(dispatch: SupplyDispatch, cluster: Cluster, url: string) {
  dispatch(SupplyStatus.Connecting);

  try {
    const connection = new Connection(url, "finalized");
    const supply = (
      await connection.getSupply({ excludeNonCirculatingAccountsList: true })
    ).value;

    // Update state if still connecting
    dispatch((state) => {
      if (state !== SupplyStatus.Connecting) return state;

      // Hide balances if cluster is mainnet
      if (cluster === Cluster.Mainnet) {
        return {
          ...supply,
          total: supply.total - HIDDEN_BALANCE,
          circulating: supply.circulating - HIDDEN_BALANCE,
        };
      }

      return supply;
    });
  } catch (err) {
    if (cluster !== Cluster.Custom) {
      reportError(err, { url });
    }
    dispatch("Failed to fetch supply");
  }
}

export function useSupply() {
  const state = useContext(SupplyStateContext);
  if (state === undefined) {
    throw new Error(`useSupply must be used within a SupplyProvider`);
  }
  return state;
}

export function useFetchSupply() {
  const dispatch = useContext(SupplyDispatchContext);
  if (!dispatch) {
    throw new Error(`useFetchSupply must be used within a SupplyProvider`);
  }

  const { cluster, url } = useCluster();
  return useCallback(() => {
    fetch(dispatch, cluster, url);
  }, [dispatch, cluster, url]);
}
