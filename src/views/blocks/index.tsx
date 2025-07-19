// Next, React
import { FC, useEffect, useState } from "react";
import { PublicKey } from "@bbachain/web3.js";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Latest Blocks
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Block Number</TableCell>
                    <TableCell>Block Hash</TableCell>
                    <TableCell>Rewards</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blocks.map((blockData, index) => {
                    return (
                      <TableRow key={`${blockData.block.blockhash}-${index}`}>
                        <TableCell>
                          <Slot slot={blockData.block.parentSlot} link />
                        </TableCell>
                        <TableCell>
                          <BlockHash
                            hash={blockData.block.blockhash}
                            truncateChars={16}
                            blockNumber={blockData.block.parentSlot}
                            link
                          />
                        </TableCell>
                        <TableCell>
                          <Balance
                            daltons={blockData.block.rewards.reduce(
                              (partialSum, a) => partialSum + a.daltons,
                              0
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          {displayTimestampUtc(
                            blockData.block.blockTime * 1000,
                            true
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {next !== null && (
              <div className="grid justify-items-center space-y-2 mt-4">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleShowMore(next)}
                >
                  Show More
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
