import React from "react";
import * as Sentry from "@sentry/react";
import { Connection, PublicKey } from "@bbachain/web3.js";

// Hooks
import * as Cache from "./useCache";
import { Cluster, useCluster } from "./useCluster";
import { Block } from "./useBlock";

const MAX_PAGINATION_PAGE = 25;

export type LatestBlocks = {
  blocks?: Block[];
  next?: number;
};

type State = Cache.State<LatestBlocks>;
type Dispatch = Cache.Dispatch<LatestBlocks>;

export const LatestBlocksStateContext = React.createContext<State | undefined>(
  undefined
);
export const LatestBlocksDispatchContext = React.createContext<
  Dispatch | undefined
>(undefined);

export async function fetchLatestBlocks(
  dispatch: Dispatch,
  url: string,
  cluster: Cluster,
  next: number
) {
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: "blocks",
    url,
  });

  let status: Cache.FetchStatus;
  let data: LatestBlocks | undefined = undefined;

  try {
    const connection = new Connection(url, "confirmed");
    const lastBlock = await connection.getBlockHeight();
    const end = Number(next) || lastBlock;

    const blocks = await connection.getBlocks(end - MAX_PAGINATION_PAGE, end);

    const result = await Promise.all(
      blocks.map(async (block) => {
        try {
          const blockData = await connection.getBlock(block, {
            maxSupportedTransactionVersion: 0,
          });
          if (blockData !== null) {
            return {
              block: blockData,
            };
          }
        } catch (err) {
          return null;
        }
      })
    );

    const validBlocks = result.filter(Boolean).reverse();

    data = {
      blocks: validBlocks,
      next: Number(end - (MAX_PAGINATION_PAGE + 1)),
    };
    status = Cache.FetchStatus.Fetched;
  } catch (err) {
    status = Cache.FetchStatus.FetchFailed;
    if (cluster !== Cluster.Custom) {
      Sentry.captureException(err, { tags: { url } });
    }
  }

  dispatch({
    type: Cache.ActionType.Update,
    url,
    key: "blocks",
    status,
    data,
  });
}

export function useLatestBlocks(): Cache.CacheEntry<LatestBlocks> | undefined {
  const context = React.useContext(LatestBlocksStateContext);

  if (!context) {
    throw new Error(
      `useLatestBlocks must be used within a LatestBlocksProvider`
    );
  }

  return context.entries["blocks"];
}

export function useFetchLatestBlocks() {
  const dispatch = React.useContext(LatestBlocksDispatchContext);
  if (!dispatch) {
    throw new Error(
      `useFetchLatestBlocks must be used within a LatestBlocksProvider`
    );
  }

  const { cluster, url } = useCluster();
  return React.useCallback(
    (next: number) => fetchLatestBlocks(dispatch, url, cluster, next),
    [dispatch, cluster, url]
  );
}
