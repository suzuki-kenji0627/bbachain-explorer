// Next, React
import { FC, useEffect, useState } from "react";
import { PublicKey } from "@bbachain/web3.js";
import { Button } from "@mui/material";

// Components
import { Slot } from "components/common/Slot";
import { Address } from "components/common/Address";
import { Balance } from "components/common/Balance";
import { BlockHash } from "components/common/BlockHash";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useFetchLatestBlocks, useLatestBlocks } from "hooks/useLatestBlocks";
import { displayTimestampUtc } from "utils/date";

export const BlocksView: FC = ({}) => {
  const { status } = useCluster();
  const confirmedBlocks = useLatestBlocks();
  const fetchLatestBlocks = useFetchLatestBlocks();
  const refresh = (next: number) => fetchLatestBlocks(next);

  const handleShowMore = (next: number) => {
    refresh(next);
  };

  // Fetch block on load
  useEffect(() => {
    if (!confirmedBlocks && status === ClusterStatus.Connected) refresh(0);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!confirmedBlocks || confirmedBlocks.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading block" />;
  } else if (
    confirmedBlocks.data === undefined ||
    confirmedBlocks.status === FetchStatus.FetchFailed
  ) {
    return <ErrorCard retry={() => refresh(0)} text="Failed to fetch block" />;
  } else if (confirmedBlocks.data.blocks === undefined) {
    return <ErrorCard retry={() => refresh(0)} text={`Blocks was not found`} />;
  }

  const { blocks, next } = confirmedBlocks.data;

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        <div className="card bg-[#011909] shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Latest Blocks</h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Block Number</th>
                    <th>Block Hash</th>
                    <th>Rewards</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((blockData, index) => {
                    return (
                      <tr key={`${blockData.block.blockhash}-${index}`}>
                        <td>
                          <Slot slot={blockData.block.parentSlot} link />
                        </td>
                        <td>
                          <BlockHash
                            hash={blockData.block.blockhash}
                            truncateChars={16}
                            blockNumber={blockData.block.parentSlot}
                            link
                          />
                        </td>
                        <td>
                          <Balance
                            daltons={blockData.block.rewards.reduce(
                              (partialSum, a) => partialSum + a.daltons,
                              0
                            )}
                          />
                        </td>
                        <td>
                          {displayTimestampUtc(
                            blockData.block.blockTime * 1000,
                            true
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="grid justify-items-center space-y-2 mt-2">
                <Button
                  className="text-[#08b642]"
                  onClick={() => handleShowMore(next)}
                >
                  Show more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
