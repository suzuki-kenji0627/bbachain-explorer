// Next, React
import {
  BlockResponse,
  ParsedTransactionWithMeta,
  SignatureStatus,
} from "@bbachain/web3.js";
import { transactions } from "@metaplex/js";
import { Box, Button, Pagination } from "@mui/material";
import { LoadingCard } from "components/common/LoadingCard";
import { FC, useEffect, useState } from "react";

type Next = {
  endSlot: number;
  endTx: number;
};

type Confirmations = {
  confirmations?: SignatureStatus;
};

type ParsedTransactionWithMetaExtended = ParsedTransactionWithMeta &
  Confirmations;

export const TransactionsView: FC = ({}) => {
  const [transactions, setTransactions] = useState<
    ParsedTransactionWithMetaExtended[]
  >([] as ParsedTransactionWithMetaExtended[]);
  const [next, setNext] = useState<Next>({} as Next);
  const [loading, setLoading] = useState<boolean>(true);

  const callAPI = async () => {
    try {
      setLoading(true);
      console.log(
        `/api/latest_transactions?endSlot=${next.endSlot}&endTx=${next.endTx}`
      );
      const res = await fetch(
        `/api/latest_transactions?endSlot=${next.endSlot}&endTx=${next.endTx}`
      );
      const data = await res.json();
      console.log(data.transactions);
      setTransactions([...transactions, ...data.transactions]);
      setNext({ endSlot: data.nextEndSlot, endTx: data.nextEndTx });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowMore = () => {
    callAPI();
  };

  useEffect(() => {
    callAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card-body">
      <h2 className="card-title">Latest Transactions</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Block Hash</th>
              <th>Status</th>
              <th>Confirmations</th>
              <th>Timestamp</th>
              <th>Signer</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              return (
                <tr key={transaction.transaction.signatures[0]}>
                  <th>
                    <div>
                      <div className="font-bold">
                        <a
                          href={`/tx/${transaction.transaction.signatures[0]}`}
                        >
                          {transaction.transaction.signatures[0].substring(
                            0,
                            30
                          )}
                          ...
                        </a>
                      </div>
                      <div className="text-sm opacity-50"></div>
                    </div>
                  </th>
                  <td>{transaction.confirmations.confirmationStatus}</td>
                  <td>
                    {transaction.confirmations.confirmationStatus ===
                    "finalized"
                      ? "max"
                      : transaction.confirmations.confirmations}
                  </td>
                  <td>{transaction.blockTime}</td>
                  <td>
                    {transaction.transaction.message.accountKeys
                      .filter((aKey) => aKey.signer === true)[0]
                      .pubkey.toString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="grid justify-items-center space-y-2 mt-2">
          {loading && (
            <LoadingCard message="Latest Transactions are Loading..." />
          )}
          <Button onClick={handleShowMore}>Show more</Button>
        </div>
      </div>
    </div>
  );
};
