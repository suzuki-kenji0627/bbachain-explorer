import React, { useState, useEffect } from "react";
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
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PublicKey } from "@bbachain/web3.js";
import Moment from "react-moment";

// Components
import { Signature } from "components/common/Signature";
import { Balance } from "components/common/Balance";

// Hooks
import {
  useFetchAddressHistory,
  useAddressHistory,
} from "hooks/useAddressHistory";
import { FetchStatus } from "hooks/useCache";

// Utils
import { ClientTimestamp } from "components/common/ClientTimestamp";

// Components
import {
  HistoryCardFooter,
  HistoryCardHeader,
  getTransactionRows,
} from "components/HistoryCardComponents";
import { LoadingCard } from "components/common/LoadingCard";
import { ErrorCard } from "components/common/ErrorCard";
import { Slot } from "components/common/Slot";

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
        <TableRow
          key={signature}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(100, 116, 139, 0.1)",
            },
          }}
        >
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Signature signature={signature} link truncateChars={60} />
          </TableCell>

          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Slot slot={slot} link />
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Balance daltons={fee} />
              <Chip
                label="BBA"
                size="small"
                sx={{
                  height: 16,
                  fontSize: "0.6rem",
                  bgcolor: "rgba(6, 214, 160, 0.1)",
                  color: "#06D6A0",
                  border: "1px solid rgba(6, 214, 160, 0.2)",
                }}
              />
            </Box>
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Balance daltons={value} />
              <Chip
                label="BBA"
                size="small"
                sx={{
                  height: 16,
                  fontSize: "0.6rem",
                  bgcolor: "rgba(6, 214, 160, 0.1)",
                  color: "#06D6A0",
                  border: "1px solid rgba(6, 214, 160, 0.2)",
                }}
              />
            </Box>
          </TableCell>

          {hasTimestamps && (
            <>
              <TableCell
                sx={{
                  borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                  py: 2,
                  color: "text.secondary",
                }}
              >
                {blockTime ? <Moment date={blockTime * 1000} fromNow /> : "---"}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                  py: 2,
                  color: "text.secondary",
                }}
              >
                {blockTime ? (
                  <ClientTimestamp
                    timestamp={blockTime * 1000}
                    utc={true}
                    includeTime={true}
                  />
                ) : (
                  "---"
                )}
              </TableCell>
            </>
          )}

          <TableCell
            sx={{
              borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
              py: 2,
            }}
          >
            <Chip
              label={statusText}
              size="small"
              color={
                statusClass === "success"
                  ? "success"
                  : statusClass === "danger"
                  ? "error"
                  : "default"
              }
              sx={{
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            />
          </TableCell>
        </TableRow>
      );
    }
  );

  const fetching = history.status === FetchStatus.Fetching;
  return (
    <Card
      sx={{
        mb: 2,
        background:
          "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 214, 160, 0.1) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            background: "rgba(30, 41, 59, 0.5)",
            p: 3,
            borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
          }}
        >
          <HistoryCardHeader
            fetching={fetching}
            refresh={() => refresh()}
            title="Transaction History"
          />
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  Transaction Signature
                </TableCell>
                <TableCell
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  Block
                </TableCell>
                <TableCell
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  Fee
                </TableCell>
                <TableCell
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  Value
                </TableCell>
                {hasTimestamps && (
                  <>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      Age
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      Timestamp
                    </TableCell>
                  </>
                )}
                <TableCell
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  Result
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{detailsList}</TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: "1px solid rgba(100, 116, 139, 0.2)",
            background: "rgba(15, 23, 42, 0.3)",
          }}
        >
          <HistoryCardFooter
            fetching={fetching}
            foundOldest={history.data.foundOldest}
            loadMore={() => loadMore()}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
