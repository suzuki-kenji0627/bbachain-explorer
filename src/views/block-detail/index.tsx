import React, { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

// Components
import { Slot } from "components/common/Slot";
import { Epoch } from "components/common/Epoch";
import { Address } from "components/common/Address";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus, useBlock, useFetchBlock } from "hooks/useBlock";
import { ClusterStatus, useCluster } from "hooks/useCluster";

// Utils
import { displayTimestampUtc } from "utils/date";
import { BlockHistoryCard } from "components/BlockHistoryCard";

type Props = { block: number };

export const BlockDetailView: FC<Props> = ({ block }) => {
  const { clusterInfo, status } = useCluster();
  const confirmedBlock = useBlock(block);
  const fetchBlock = useFetchBlock();
  const refresh = () => fetchBlock(block);

  // Fetch block on load
  React.useEffect(() => {
    if (!confirmedBlock && status === ClusterStatus.Connected) refresh();
  }, [block, status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!confirmedBlock || confirmedBlock.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading block" />;
  } else if (
    confirmedBlock.data === undefined ||
    confirmedBlock.status === FetchStatus.FetchFailed
  ) {
    return <ErrorCard retry={refresh} text="Failed to fetch block" />;
  } else if (confirmedBlock.data.block === undefined) {
    return <ErrorCard retry={refresh} text={`Block ${block} was not found`} />;
  }

  const { block: blockData, blockLeader, childSlot } = confirmedBlock.data;
  const epoch = clusterInfo?.epochSchedule.getEpoch(block);

  const showSuccessfulCount = blockData.transactions.every(
    (tx) => tx.meta !== null
  );
  const successfulTxs = blockData.transactions.filter(
    (tx) => tx.meta?.err === null
  );

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        <Card className="bg-[#011909] shadow-xl mb-4">
          <CardContent>
            <Typography variant="h5" component="h2">
              Overview
            </Typography>

            {/* Overview */}
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Blockhash</TableCell>
                    <TableCell>{blockData.blockhash}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Block Number</TableCell>
                    <TableCell>{block}</TableCell>
                  </TableRow>
                  {blockLeader !== undefined && (
                    <TableRow>
                      <TableCell>Proposer</TableCell>
                      <TableCell align="right">
                        <Address pubkey={blockLeader} link />
                      </TableCell>
                    </TableRow>
                  )}
                  {blockData.blockTime ? (
                    <TableRow>
                      <TableCell>Timestamp (UTC)</TableCell>
                      <TableCell align="right">
                        <span className="font-monospace">
                          {displayTimestampUtc(
                            blockData.blockTime * 1000,
                            true
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell align="right">Unavailable</TableCell>
                    </TableRow>
                  )}
                  {epoch !== undefined && (
                    <TableRow>
                      <TableCell>Epoch</TableCell>
                      <TableCell align="right" className="font-monospace">
                        <Epoch epoch={epoch} link />
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>Previous Blockhash</TableCell>
                    <TableCell align="right" className="font-monospace">
                      <span>{blockData.previousBlockhash}</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Previous Block</TableCell>
                    <TableCell align="right" className="font-monospace">
                      <Slot slot={blockData.parentSlot} link />
                    </TableCell>
                  </TableRow>
                  {childSlot !== undefined && (
                    <TableRow>
                      <TableCell>Next Block</TableCell>
                      <TableCell align="right" className="font-monospace">
                        <Slot slot={childSlot} link />
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>Transactions</TableCell>
                    <TableCell align="right" className="font-monospace">
                      <span>
                        Total success {successfulTxs.length}/
                        {blockData.transactions.length} transactions
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <BlockHistoryCard block={blockData} />
      </div>
    </div>
  );
};
