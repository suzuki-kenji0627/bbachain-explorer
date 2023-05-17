import { Button } from "@mui/material";
import { Balance } from "components/common/Balance";
import { BlockHash } from "components/common/BlockHash";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { Slot } from "components/common/Slot";
import { Time } from "components/common/Time";
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useFetchLatestBlocks, useLatestBlocks } from "hooks/useLatestBlocks";
import Link from "next/link";
import { FC, useEffect } from "react";

export const LatestBlocks: FC = ({}) => {
  const { status } = useCluster();
  const confirmedBlocks = useLatestBlocks();
  const fetchLatestBlocks = useFetchLatestBlocks();
  const refresh = () => fetchLatestBlocks(0);
  const BLOCK_TIME_INTERVAL = 5000;

  // Fetch block on load
  useEffect(() => {
    if (status === ClusterStatus.Connected) {
      refresh();
      const getBlocksInterval = setInterval(refresh, BLOCK_TIME_INTERVAL);
      return () => clearInterval(getBlocksInterval);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (
    !confirmedBlocks ||
    confirmedBlocks.status ||
    confirmedBlocks.data === undefined
  ) {
    return <LoadingCard message="Loading block" />;
  } else if (confirmedBlocks.status === FetchStatus.FetchFailed) {
    return <ErrorCard retry={() => refresh()} text="Failed to fetch block" />;
  }

  const { blocks, next } = confirmedBlocks.data;
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Latest Blocks</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Block</th>
                <th>Block Hash</th>
                <th>Rewards (BBA)</th>
              </tr>
            </thead>
            <tbody>
              {blocks.slice(0, 3).map((block, index) => {
                return (
                  <tr key={block.block.blockhash}>
                    <th>
                      <div>
                        <Slot slot={block.block.parentSlot} link />
                        <Time timestamp={block.block.blockTime} />
                      </div>
                    </th>
                    <td>
                      <BlockHash
                        hash={block.block.blockhash}
                        truncateChars={8}
                        blockNumber={block.block.parentSlot}
                        link
                      />
                    </td>
                    <td>
                      <Balance
                        daltons={block.block.rewards.reduce(
                          (partialSum, a) => partialSum + a.daltons,
                          0
                        )}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="grid justify-items-center space-y-2 mt-2">
            <Link href="/blocks">Show more</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
