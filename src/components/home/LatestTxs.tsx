// Next, React
import { FC, useEffect } from "react";
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

// Components
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { Signature } from "components/common/Signature";
import { Signer } from "components/common/Signer";
import { Status } from "components/common/Status";
import { Time } from "components/common/Time";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import {
  useFetchLatestTransactions,
  useLatestTransactions,
} from "hooks/useLatestTransactions";
import Link from "next/link";

export const LatestTxs: FC = ({}) => {
  const { status } = useCluster();
  const confirmedTransactions = useLatestTransactions();
  const fetchLatestTransactions = useFetchLatestTransactions();
  const refresh = (page?: number, pageSize?: number) =>
    fetchLatestTransactions(page || 0, pageSize || 25);
  const BLOCK_TIME_INTERVAL = 5000;

  useEffect(() => {
    refresh(0, 25);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch Transaction on load
  useEffect(() => {
    if (!confirmedTransactions && status === ClusterStatus.Connected)
      refresh(0, 25);
    const getTxInterval = setInterval(refresh, BLOCK_TIME_INTERVAL);
    return () => clearInterval(getTxInterval);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (
    !confirmedTransactions ||
    confirmedTransactions.status ||
    confirmedTransactions.data === undefined
  ) {
    return <LoadingCard message="Loading transactions" />;
  } else if (confirmedTransactions.status === FetchStatus.FetchFailed) {
    return (
      <ErrorCard
        retry={() => refresh(0, 25)}
        text="Failed to fetch transaction"
      />
    );
  }

  const { transactions } = confirmedTransactions.data;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Latest Transactions
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TX Hash</TableCell>
                <TableCell>Signer</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(0, 10).map((transactionData, index) => {
                return (
                  <TableRow key={`${transactionData.signature}-${index}`}>
                    <TableCell>
                      <Signature
                        signature={transactionData.signature}
                        truncateChars={16}
                        link
                      />
                      <Time timestamp={transactionData.blockTime} />
                    </TableCell>

                    <TableCell>
                      <Signer
                        signer={transactionData.signer || ""}
                        truncateChars={16}
                      />
                    </TableCell>
                    <TableCell>
                      <Status confirmations={transactionData.confirmations} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Link href="/transactions" passHref>
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
