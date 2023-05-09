import React from "react";

// Hooks
import * as Cache from "hooks/useCache";
import { Cluster, useCluster } from "./useCluster";

// Utils
import { reportError } from "utils/sentry";
import { Connection, EpochSchedule } from "@bbachain/web3.js";

export type Epoch = {
  firstBlock: number;
  firstTimestamp: number | null;
  lastBlock?: number;
  lastTimestamp: number | null;
};

type EpochState = Cache.State<Epoch>;
type EpochDispatch = Cache.Dispatch<Epoch>;

export const EpochStateContext = React.createContext<EpochState | undefined>(undefined);
export const EpochDispatchContext = React.createContext<EpochDispatch | undefined>(undefined);

export async function fetchEpoch(
  dispatch: EpochDispatch,
  url: string,
  cluster: Cluster,
  epochSchedule: EpochSchedule,
  currentEpoch: number,
  epoch: number
) {
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: epoch,
    url,
  });

  let status: Cache.FetchStatus;
  let data: Epoch | undefined = undefined;

  try {
    const connection = new Connection(url, "confirmed");
    const firstSlot = epochSchedule.getFirstSlotInEpoch(epoch);
    const lastSlot = epochSchedule.getLastSlotInEpoch(epoch);
    const [firstBlock, lastBlock] = await Promise.all([
      (async () => {
        const firstBlocks = await connection.getBlocks(
          firstSlot,
          firstSlot + 100
        );
        return firstBlocks.shift();
      })(),
      (async () => {
        const lastBlocks = await connection.getBlocks(
          Math.max(0, lastSlot - 100),
          lastSlot
        );
        return lastBlocks.pop();
      })(),
    ]);

    if (firstBlock === undefined) {
      throw new Error(
        `failed to find confirmed block at start of epoch ${epoch}`
      );
    } else if (epoch < currentEpoch && lastBlock === undefined) {
      throw new Error(
        `failed to find confirmed block at end of epoch ${epoch}`
      );
    }

    const [firstTimestamp, lastTimestamp] = await Promise.all([
      connection.getBlockTime(firstBlock),
      lastBlock ? connection.getBlockTime(lastBlock) : null,
    ]);

    data = {
      firstBlock,
      lastBlock,
      firstTimestamp,
      lastTimestamp,
    };
    status = Cache.FetchStatus.Fetched;
  } catch (err) {
    status = Cache.FetchStatus.FetchFailed;
    if (cluster !== Cluster.Custom) {
      reportError(err, { epoch: epoch.toString() });
    }
  }

  dispatch({
    type: Cache.ActionType.Update,
    url,
    key: epoch,
    status,
    data,
  });
}

export function useEpoch(key: number): Cache.CacheEntry<Epoch> | undefined {
  const context = React.useContext(EpochStateContext);

  if (!context) {
    throw new Error(`useEpoch must be used within a EpochProvider`);
  }

  return context.entries[key];
}

export function useFetchEpoch() {
  const dispatch = React.useContext(EpochDispatchContext);
  if (!dispatch) {
    throw new Error(`useFetchEpoch must be used within a EpochProvider`);
  }

  const { cluster, url } = useCluster();
  return React.useCallback(
    (key: number, currentEpoch: number, epochSchedule: EpochSchedule) =>
      fetchEpoch(dispatch, url, cluster, epochSchedule, currentEpoch, key),
    [dispatch, cluster, url]
  );
}
