import React from "react";
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
        <tr key={signature}>
          <td>
            <Signature signature={signature} link truncateChars={60} />
          </td>

          <td className="w-1">
            <Slot slot={slot} link />
          </td>
          <td className="w-1">
            <Balance daltons={fee} />
          </td>
          <td className="w-1">
            <Balance daltons={history?.data.transactionMap[signature]} />
          </td>

          {hasTimestamps && (
            <>
              <td className="text-muted">
                {blockTime ? <Moment date={blockTime * 1000} fromNow /> : "---"}
              </td>
              <td className="text-muted">
                {blockTime
                  ? displayTimestampUtc(blockTime * 1000, true)
                  : "---"}
              </td>
            </>
          )}

          <td>
            <span className={`badge bg-${statusClass}-soft`}>{statusText}</span>
          </td>
        </tr>
      );
    }
  );

  const fetching = history.status === FetchStatus.Fetching;
  return (
    <div className="card bg-[#011909] shadow-xl mb-4">
      <div className="card-body">
        <HistoryCardHeader
          fetching={fetching}
          refresh={() => refresh()}
          title="Transaction History"
        />
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-muted w-1">Transaction Signature</th>
                <th className="text-muted w-1">Block</th>
                <th className="text-muted w-1">Fee</th>
                <th className="text-muted w-1">Value</th>
                {hasTimestamps && (
                  <>
                    <th className="text-muted w-1">Age</th>
                    <th className="text-muted w-1">Timestamp</th>
                  </>
                )}
                <th className="text-muted">Result</th>
              </tr>
            </thead>
            <tbody className="list">{detailsList}</tbody>
          </table>
        </div>
        <HistoryCardFooter
          fetching={fetching}
          foundOldest={history.data.foundOldest}
          loadMore={() => loadMore()}
        />
      </div>
    </div>
  );
}
