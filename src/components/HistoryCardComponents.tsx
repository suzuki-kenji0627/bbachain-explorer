import React from "react";
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
    <>
      <h3 className="card-title">{title}</h3>
      {/* <button
        className="btn btn-white btn-sm"
        disabled={fetching}
        onClick={() => refresh()}
      >
        {fetching ? (
          <>
            <span className="spinner-grow spinner-grow-sm me-2"></span>
            Loading
          </>
        ) : (
          <>
            <span className="fe fe-refresh-cw me-2"></span>
            Refresh
          </>
        )}
      </button> */}
    </>
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
    <div className="card-footer">
      {foundOldest ? (
        <div className="text-muted text-center">Fetched full history</div>
      ) : (
        <button
          className="btn btn-primary w-100"
          onClick={() => loadMore()}
          disabled={fetching}
        >
          {fetching ? (
            <>
              <span className="spinner-grow spinner-grow-sm me-2"></span>
              Loading
            </>
          ) : (
            "Load More"
          )}
        </button>
      )}
    </div>
  );
}

export function getTransactionRows(
  transactions: ConfirmedSignatureInfo[],
  txMap: Map<string, ParsedTransactionWithMeta>
): TransactionRow[] {
  const transactionRows: TransactionRow[] = [];
  for (var i = 0; i < transactions.length; i++) {
    const slot = transactions[i].slot;
    console.log(txMap);
    const fee = txMap.get(transactions[i].signature)?.meta?.fee;
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
        value: 0,
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
