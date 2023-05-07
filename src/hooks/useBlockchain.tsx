import React from "react";
import * as Sentry from "@sentry/react";
import { Connection, PublicKey, VersionedBlockResponse } from "@bbachain/web3.js";

// Hooks
import * as Cache from "./useCache";
import { Cluster, useCluster } from "./useCluster";

export enum FetchStatus {
  Fetching,
  FetchFailed,
  Fetched,
}

export type Block = {
  block?: VersionedBlockResponse;
  blockLeader?: PublicKey;
  childSlot?: number;
  childLeader?: PublicKey;
  parentLeader?: PublicKey;
};

type State = Cache.State<Block>;
type Dispatch = Cache.Dispatch<Block>;

export const BlockchainStateContext = React.createContext<State | undefined>(undefined);
export const BlockchainDispatchContext = React.createContext<Dispatch | undefined>(undefined);

export async function fetchBlock(dispatch: Dispatch, url: string, cluster: Cluster, slot: number) {
  dispatch({
    type: Cache.ActionType.Update,
    status: FetchStatus.Fetching,
    key: slot,
    url,
  });

  let status: FetchStatus;
  let data: Block | undefined = undefined;

  try {
    const connection = new Connection(url, "confirmed");
    const block = await connection.getBlock(slot, {
      maxSupportedTransactionVersion: 0,
    });
    if (block === null) {
      data = {};
      status = FetchStatus.Fetched;
    } else {
      const childSlot = (
        await connection.getBlocks(slot + 1, slot + 100)
      ).shift();
      const firstLeaderSlot = block.parentSlot;

      let leaders: PublicKey[] = [];
      try {
        const lastLeaderSlot = childSlot !== undefined ? childSlot : slot;
        const slotLeadersLimit = lastLeaderSlot - block.parentSlot + 1;
        leaders = await connection.getSlotLeaders(
          firstLeaderSlot,
          slotLeadersLimit
        );
      } catch (err) {
        // ignore errors
      }

      const getLeader = (slot: number) => {
        return leaders.at(slot - firstLeaderSlot);
      };

      data = {
        block,
        blockLeader: getLeader(slot),
        childSlot,
        childLeader: childSlot !== undefined ? getLeader(childSlot) : undefined,
        parentLeader: getLeader(block.parentSlot),
      };
      status = FetchStatus.Fetched;
    }
  } catch (err) {
    status = FetchStatus.FetchFailed;
    if (cluster !== Cluster.Custom) {
      Sentry.captureException(err, { tags: { url } });
    }
  }

  dispatch({
    type: Cache.ActionType.Update,
    url,
    key: slot,
    status,
    data,
  });
}

export function useBlockchain(key: number): Cache.CacheEntry<Block> | undefined {
  const context = React.useContext(BlockchainStateContext);

  if (!context) {
    throw new Error(`useBlockchain must be used within a BlockchainProvider`);
  }

  return context.entries[key];
}

export function useFetchBlock() {
  const dispatch = React.useContext(BlockchainDispatchContext);
  if (!dispatch) {
    throw new Error(`useFetchBlock must be used within a BlockProvider`);
  }

  const { cluster, url } = useCluster();
  return React.useCallback(
    (key: number) => fetchBlock(dispatch, url, cluster, key),
    [dispatch, cluster, url]
  );
}
