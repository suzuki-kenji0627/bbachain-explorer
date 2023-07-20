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
import { Time } from "components/common/Time";
import Link from "next/link";

export const LatestTxs: FC = ({}) => {
  const { status } = useCluster();
  const confirmedTransactions = useLatestTransactions();
  const fetchLatestTransactions = useFetchLatestTransactions();
  const refresh = (page?: number, pageSize?: number) =>
    fetchLatestTransactions(page || 0, pageSize || 25);
  const BLOCK_TIME_INTERVAL = 5000;

  // Fetch Transaction on load
  useEffect(() => {
    if (!confirmedTransactions && status === ClusterStatus.Connected)
      refresh(0, 3);
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
        retry={() => refresh(0, 3)}
        text="Failed to fetch transaction"
      />
    );
  }

  const { transactions } = confirmedTransactions.data;
  return (
    <div className="card bg-[#011909] shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Latest Transactions</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>TX Hash</th>
                <th>Signer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((transactionData) => {
                return (
                  <tr key={transactionData.signature}>
                    <td>
                      <Signature
                        signature={transactionData.signature}
                        truncateChars={16}
                        link
                      />
                      <Time timestamp={transactionData.blockTime} />
                    </td>

                    <td>
                      <Signer
                        accountKeys={
                          transactionData.transaction.message.accountKeys
                        }
                        truncateChars={16}
                      />
                    </td>
                    <td>
                      <Status confirmations={transactionData.confirmations} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="grid justify-items-center space-y-2 mt-2">
            <Link className="text-[#08b642]" href="/transactions">
              Show more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
