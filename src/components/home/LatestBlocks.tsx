import { Button } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Link as MuiLink,
} from "@mui/material";
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
  const BLOCK_TIME_INTERVAL = 20000;

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
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Latest Blocks
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Block</TableCell>
                <TableCell>Block Hash</TableCell>
                <TableCell>Rewards (BBA)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blocks.slice(0, 10).map((block, index) => {
                return (
                  <TableRow key={`${block.block.blockhash}-${index}`}>
                    <TableCell>
                      <Box>
                        <Slot slot={block.block.parentSlot} link />
                        <Time timestamp={block.block.blockTime} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <BlockHash
                        hash={block.block.blockhash}
                        truncateChars={8}
                        blockNumber={block.block.parentSlot}
                        link
                      />
                    </TableCell>
                    <TableCell>
                      <Balance
                        daltons={block.block.rewards.reduce(
                          (partialSum, a) => partialSum + a.daltons,
                          0
                        )}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Link href="/blocks" passHref>
            <MuiLink
              color="success.light"
              underline="hover"
              sx={{ cursor: "pointer" }}
            >
              Show more
            </MuiLink>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};
