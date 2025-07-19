import React, { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

// Components
import { Epoch } from "./common/Epoch";
import { Slot } from "./common/Slot";
import { LoadingCard } from "./common/LoadingCard";
import { ErrorCard } from "./common/ErrorCard";
import { FetchStatus } from "hooks/useCache";

// Hooks
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useEpoch, useFetchEpoch } from "hooks/useEpoch";

// Utils
import { displayTimestampUtc } from "utils/date";

type Props = {
  epoch: number;
};

export const EpochOverviewCard: FC<Props> = ({ epoch }) => {
  const { status, clusterInfo } = useCluster();

  const epochState = useEpoch(epoch);
  const fetchEpoch = useFetchEpoch();

  // Fetch extra epoch info on load
  React.useEffect(() => {
    if (!clusterInfo) return;
    const { epochInfo, epochSchedule } = clusterInfo;
    const currentEpoch = epochInfo.epoch;
    if (
      epoch <= currentEpoch &&
      !epochState &&
      status === ClusterStatus.Connected
    )
      fetchEpoch(epoch, currentEpoch, epochSchedule);
  }, [epoch, epochState, clusterInfo, status, fetchEpoch]);

  if (!clusterInfo) {
    return <LoadingCard message="Connecting to cluster" />;
  }

  const { epochInfo, epochSchedule } = clusterInfo;
  const currentEpoch = epochInfo.epoch;
  if (epoch > currentEpoch) {
    return <ErrorCard text={`Epoch ${epoch} hasn't started yet`} />;
  } else if (!epochState?.data) {
    if (epochState?.status === FetchStatus.FetchFailed) {
      return <ErrorCard text={`Failed to fetch details for epoch ${epoch}`} />;
    }
    return <LoadingCard message="Loading epoch" />;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Overview Epoch <Epoch epoch={epoch} />
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {epoch > 0 && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Previous Epoch
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                    <Epoch epoch={epoch - 1} link />
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell component="th" scope="row">
                  Next Epoch
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                  {currentEpoch > epoch ? (
                    <Epoch epoch={epoch + 1} link />
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>
                      Epoch in progress
                    </span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  First Block
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                  <Slot slot={epochState.data.firstBlock} link />
                </TableCell>
              </TableRow>
              {epochState.data.firstTimestamp && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    First Block Timestamp
                  </TableCell>
                  <TableCell align="right">
                    <span style={{ fontFamily: "monospace" }}>
                      {displayTimestampUtc(
                        epochState.data.firstTimestamp * 1000,
                        true
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell component="th" scope="row">
                  Last Block
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                  {epochState.data.lastBlock !== undefined ? (
                    <Slot slot={epochState.data.lastBlock} link />
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>
                      Epoch in progress
                    </span>
                  )}
                </TableCell>
              </TableRow>
              {epochState.data.lastTimestamp && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Last Block Timestamp
                  </TableCell>
                  <TableCell align="right">
                    <span style={{ fontFamily: "monospace" }}>
                      {displayTimestampUtc(
                        epochState.data.lastTimestamp * 1000,
                        true
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
