import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import Moment from "react-moment";
import { PublicKey } from "@bbachain/web3.js";

// Components
import {
  HistoryCardFooter,
  HistoryCardHeader,
  getTransactionRows,
} from "components/HistoryCardComponents";
import { LoadingCard } from "components/common/LoadingCard";
import { ErrorCard } from "components/common/ErrorCard";
import { Signature } from "components/common/Signature";
import { Slot } from "components/common/Slot";

// Hooks
import { FetchStatus } from "hooks/useCache";
import {
  useAddressHistory,
  useFetchAddressHistory,
} from "hooks/useAddressHistory";

// Utils
import { displayTimestampUtc } from "utils/date";
import { Balance } from "components/common/Balance";

export function TransactionHistoryCard({ pubkey }: { pubkey: PublicKey }) {
  const address = pubkey.toBase58();
  const history = useAddressHistory(address);
  const fetchAccountHistory = useFetchAddressHistory();
  const refresh = () => fetchAccountHistory(pubkey, true, true);
  const loadMore = () => fetchAccountHistory(pubkey, true);

  const transactionRows = React.useMemo(() => {
    if (history?.data?.fetched && history?.data?.transactionMap) {
      return getTransactionRows(
        history.data.fetched,
        history.data.transactionMap
      );
    }
    return [];
  }, [history]);

  React.useEffect(() => {
    if (!history) {
      refresh();
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!history) {
    return null;
  }

  if (history?.data === undefined) {
    if (history.status === FetchStatus.Fetching) {
      return <LoadingCard message="Loading history" />;
    }

    return (
      <ErrorCard retry={refresh} text="Failed to fetch transaction history" />
    );
  }

  const hasTimestamps = transactionRows.some((element) => element.blockTime);
  const detailsList: React.ReactNode[] = transactionRows.map(
    ({ slot, signature, fee, value, blockTime, statusClass, statusText }) => {
      return (
        <TableRow key={signature}>
          <TableCell>
            <Signature signature={signature} link truncateChars={60} />
          </TableCell>

          <TableCell className="w-1">
            <Slot slot={slot} link />
          </TableCell>
          <TableCell className="w-1">
            <Balance daltons={fee} />
          </TableCell>
          <TableCell className="w-1">
            <Balance daltons={value} />
          </TableCell>

          {hasTimestamps && (
            <>
              <TableCell className="text-muted">
                {blockTime ? <Moment date={blockTime * 1000} fromNow /> : "---"}
              </TableCell>
              <TableCell className="text-muted">
                {blockTime
                  ? displayTimestampUtc(blockTime * 1000, true)
                  : "---"}
              </TableCell>
            </>
          )}

          <TableCell>
            <span className={`badge bg-${statusClass}-soft`}>{statusText}</span>
          </TableCell>
        </TableRow>
      );
    }
  );

  const fetching = history.status === FetchStatus.Fetching;
  return (
    <Card className="bg-[#011909] shadow-xl mb-4">
      <CardContent>
        <HistoryCardHeader
          fetching={fetching}
          refresh={() => refresh()}
          title="Transaction History"
        />
        <TableContainer>
          <Table className="w-full">
            <TableHead>
              <TableRow>
                <TableCell className="text-muted w-1">
                  Transaction Signature
                </TableCell>
                <TableCell className="text-muted w-1">Block</TableCell>
                <TableCell className="text-muted w-1">Fee</TableCell>
                <TableCell className="text-muted w-1">Value</TableCell>
                {hasTimestamps && (
                  <>
                    <TableCell className="text-muted w-1">Age</TableCell>
                    <TableCell className="text-muted w-1">Timestamp</TableCell>
                  </>
                )}
                <TableCell className="text-muted">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="list">{detailsList}</TableBody>
          </Table>
        </TableContainer>
        <HistoryCardFooter
          fetching={fetching}
          foundOldest={history.data.foundOldest}
          loadMore={() => loadMore()}
        />
      </CardContent>
    </Card>
  );
}
