// Next, React
import { FC, useEffect, useState } from "react";
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
import { Signature } from "components/common/Signature";
import { Confirmations } from "components/common/Confirmations";
import { Signer } from "components/common/Signer";
import { Status } from "components/common/Status";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import {
  useFetchLatestTransactions,
  useLatestTransactions,
} from "hooks/useLatestTransactions";
import { displayTimestampUtc } from "utils/date";

export const TransactionsView: FC = ({}) => {
  const { status } = useCluster();
  const confirmedTransactions = useLatestTransactions();
  const fetchLatestTransactions = useFetchLatestTransactions();
  const refresh = (page: number, pageSize: number) =>
    fetchLatestTransactions(page, pageSize);

  const handleShowMore = (page: number) => {
    refresh(page, 25);
  };

  // Fetch Transaction on load
  useEffect(() => {
    if (!confirmedTransactions && status === ClusterStatus.Connected)
      refresh(0, 25);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (
    !confirmedTransactions ||
    confirmedTransactions.status === FetchStatus.Fetching
  ) {
    return <LoadingCard message="Loading transactions" />;
  } else if (
    confirmedTransactions.data === undefined ||
    confirmedTransactions.status === FetchStatus.FetchFailed
  ) {
    return (
      <ErrorCard
        retry={() => refresh(0, 25)}
        text="Failed to fetch transaction"
      />
    );
  } else if (confirmedTransactions.data.transactions === undefined) {
    return (
      <ErrorCard
        retry={() => refresh(0, 25)}
        text={`Transaction was not found`}
      />
    );
  }

  const { transactions, nextPage } = confirmedTransactions.data;

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Latest Transactions
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Signature</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Confirmations</TableCell>
                    <TableCell>Signer</TableCell>
                    <TableCell>Block</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transactionData, index) => {
                    return (
                      <TableRow key={`${transactionData.signature}-${index}`}>
                        <TableCell>
                          <Signature
                            signature={transactionData.signature}
                            truncateChars={16}
                            link
                          />
                        </TableCell>
                        <TableCell>
                          <Status
                            confirmations={transactionData.confirmations}
                          />
                        </TableCell>
                        <TableCell>
                          <Confirmations
                            confirmations={transactionData.confirmations}
                          />
                        </TableCell>
                        <TableCell>
                          <Signer
                            signer={transactionData.signer || ""}
                            truncateChars={16}
                          />
                        </TableCell>
                        <TableCell>
                          <Slot slot={transactionData.slot} link />
                        </TableCell>
                        <TableCell>
                          {displayTimestampUtc(
                            transactionData.blockTime * 1000,
                            true
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {nextPage !== null && (
              <div className="grid justify-items-center space-y-2 mt-4">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleShowMore(nextPage)}
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
