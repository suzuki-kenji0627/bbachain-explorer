import React from "react";
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  CardActions,
} from "@mui/material";
import {
  ConfirmedSignatureInfo,
  ParsedTransactionWithMeta,
  TransactionError,
} from "@bbachain/web3.js";

export type TransactionRow = {
  slot: number;
  signature: string;
  fee: number;
  value: number;
  err: TransactionError | null;
  blockTime: number | null | undefined;
  statusClass: string;
  statusText: string;
  signatureInfo: ConfirmedSignatureInfo;
};

export function HistoryCardHeader({
  title,
  refresh,
  fetching,
}: {
  title: string;
  refresh: Function;
  fetching: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h5" component="h3">
        {title}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        disabled={fetching}
        onClick={() => refresh()}
        startIcon={
          fetching ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {fetching ? "Loading" : "⟳ Refresh"}
      </Button>
    </Box>
  );
}

export function HistoryCardFooter({
  fetching,
  foundOldest,
  loadMore,
}: {
  fetching: boolean;
  foundOldest: boolean;
  loadMore: Function;
}) {
  return (
    <CardActions sx={{ justifyContent: "center", pt: 2 }}>
      {foundOldest ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Fetched full history
        </Typography>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => loadMore()}
          disabled={fetching}
          startIcon={
            fetching ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {fetching ? "Loading" : "Load More"}
        </Button>
      )}
    </CardActions>
  );
}

export function getTransactionRows(
  transactions: ConfirmedSignatureInfo[],
  txMap: Map<string, ParsedTransactionWithMeta>
): TransactionRow[] {
  const transactionRows: TransactionRow[] = [];
  for (var i = 0; i < transactions.length; i++) {
    const slot = transactions[i].slot;
    const fee = txMap.get(transactions[i].signature)?.meta?.fee;
    const value =
      txMap.get(transactions[i].signature).meta.preBalances[0] -
      txMap.get(transactions[i].signature).meta.postBalances[0];
    const slotTransactions = [transactions[i]];
    while (i + 1 < transactions.length) {
      const nextSlot = transactions[i + 1].slot;
      if (nextSlot !== slot) break;
      slotTransactions.push(transactions[++i]);
    }

    for (let slotTransaction of slotTransactions) {
      let statusText;
      let statusClass;
      if (slotTransaction.err) {
        statusClass = "warning";
        statusText = "Failed";
      } else {
        statusClass = "success";
        statusText = "Success";
      }
      transactionRows.push({
        slot,
        signature: slotTransaction.signature,
        fee,
        value,
        err: slotTransaction.err,
        blockTime: slotTransaction.blockTime,
        statusClass,
        statusText,
        signatureInfo: slotTransaction,
      });
    }
  }

  return transactionRows;
}
