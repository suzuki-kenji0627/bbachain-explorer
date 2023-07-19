// Next, React
import { FC, useEffect, useState } from "react";
import { Button } from "@mui/material";

// Components
import { Slot } from "components/common/Slot";
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
import { Signature } from "components/common/Signature";
import { Confirmations } from "components/common/Confirmations";
import { Signer } from "components/common/Signer";
import { Status } from "components/common/Status";

export const TransactionsView: FC = ({}) => {
  const { status } = useCluster();
  const confirmedTransactions = useLatestTransactions();
  const fetchLatestTransactions = useFetchLatestTransactions();
  const refresh = (nextEndSlot: number, nextEndTx: number) =>
    fetchLatestTransactions(nextEndSlot, nextEndTx);

  const handleShowMore = (nextEndSlot: number, nextEndTx: number) => {
    refresh(nextEndSlot, nextEndTx);
  };

  // Fetch Transaction on load
  useEffect(() => {
    if (!confirmedTransactions && status === ClusterStatus.Connected)
      refresh(0, 0);
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
        retry={() => refresh(0, 0)}
        text="Failed to fetch transaction"
      />
    );
  } else if (confirmedTransactions.data.transactions === undefined) {
    return (
      <ErrorCard
        retry={() => refresh(0, 0)}
        text={`Transaction was not found`}
      />
    );
  }

  const { transactions, nextEndSlot, nextEndTx } = confirmedTransactions.data;

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        <div className="card bg-[#011909] shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Latest Transactions</h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Signature</th>
                    <th>Status</th>
                    <th>Confirmations</th>
                    <th>Signer</th>
                    <th>Block</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transactionData) => {
                    return (
                      <tr key={transactionData.signature}>
                        <td>
                          <Signature
                            signature={transactionData.signature}
                            truncateChars={16}
                            link
                          />
                        </td>
                        <td>
                          <Status
                            confirmations={transactionData.confirmations}
                          />
                        </td>
                        <td>
                          <Confirmations
                            confirmations={transactionData.confirmations}
                          />
                        </td>
                        <td>
                          <Signer
                            accountKeys={
                              transactionData.transaction.message.accountKeys
                            }
                          />
                        </td>
                        <td>
                          <Slot slot={transactionData.slot} link />
                        </td>
                        <td>
                          {displayTimestampUtc(
                            transactionData.blockTime * 1000,
                            true
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="grid justify-items-center space-y-2 mt-2">
                <Button
                  className="text-[#08b642]"
                  onClick={() => handleShowMore(nextEndSlot, nextEndTx)}
                >
                  Show more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
