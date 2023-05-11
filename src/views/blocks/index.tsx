// Next, React
import { FC, useEffect, useState } from "react";
import { Button } from "@mui/material";

// Components
import { Slot } from "components/common/Slot";
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
        <div className="card bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Latest Blocks</h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Block</th>
                    <th>Block Hash</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((blockData) => {
                    return (
                      <tr key={blockData.block.blockhash}>
                        <td><Slot slot={blockData.block.parentSlot} link /></td>
                        <td>{blockData.block.blockhash}</td>
                        <td>
                          {displayTimestampUtc(blockData.block.blockTime * 1000, true)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="grid justify-items-center space-y-2 mt-2">
                <Button onClick={() => handleShowMore(next)}>Show more</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
