import React from "react";
import {
  ConfirmedTransactionMeta,
  PublicKey,
  TransactionSignature,
  VersionedBlockResponse,
} from "@bbachain/web3.js";

// Components
import { Address } from "./common/Address";
import { Balance } from "./common/Balance";
import { Signature } from "./common/Signature";
import { ErrorCard } from "./common/ErrorCard";

// Hooks
import { useCluster } from "hooks/useCluster";

// Utils
import { parseProgramLogs } from "utils/program-logs";

type TransactionWithInvocations = {
  index: number;
  signature?: TransactionSignature;
  meta: ConfirmedTransactionMeta | null;
  invocations: Map<string, number>;
  computeUnits?: number;
  logTruncated: boolean;
};

const PAGE_SIZE = 25;

export function BlockHistoryCard({ block }: { block: VersionedBlockResponse }) {
  const { cluster } = useCluster();

  const [numDisplayed, setNumDisplayed] = React.useState(PAGE_SIZE);

  const { transactions } = React.useMemo(() => {
    const invokedPrograms = new Map<string, number>();

    const transactions: TransactionWithInvocations[] = block.transactions.map(
      (tx, index) => {
        let signature: TransactionSignature | undefined;
        if (tx.transaction.signatures.length > 0) {
          signature = tx.transaction.signatures[0];
        }

        let programIndexes = tx.transaction.message.compiledInstructions
          .map((ix) => ix.programIdIndex)
          .concat(
            tx.meta?.innerInstructions?.flatMap((ix) => {
              return ix.instructions.map((ix) => ix.programIdIndex);
            }) || []
          );

        const indexMap = new Map<number, number>();
        programIndexes.forEach((programIndex) => {
          const count = indexMap.get(programIndex) || 0;
          indexMap.set(programIndex, count + 1);
        });

        const invocations = new Map<string, number>();
        const accountKeys = tx.transaction.message.getAccountKeys({
          accountKeysFromLookups: tx.meta?.loadedAddresses,
        });
        for (const [i, count] of indexMap.entries()) {
          const programId = accountKeys.get(i)!.toBase58();
          invocations.set(programId, count);
          const programTransactionCount = invokedPrograms.get(programId) || 0;
          invokedPrograms.set(programId, programTransactionCount + 1);
        }

        let logTruncated = false;
        let computeUnits: number | undefined = undefined;
        try {
          const parsedLogs = parseProgramLogs(
            tx.meta?.logMessages ?? [],
            tx.meta?.err ?? null,
            cluster
          );

          logTruncated = parsedLogs[parsedLogs.length - 1].truncated;
          computeUnits = parsedLogs
            .map(({ computeUnits }) => computeUnits)
            .reduce((sum, next) => sum + next);
        } catch (err) {
          // ignore parsing errors because some old logs aren't parsable
        }

        return {
          index,
          signature,
          meta: tx.meta,
          invocations,
          computeUnits,
          logTruncated,
        };
      }
    );
    return { transactions, invokedPrograms };
  }, [block, cluster]);

  if (transactions.length === 0) {
    return <ErrorCard text="This block has no transactions" />;
  }

  return (
    <div className="card bg-[#011909] shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-muted">#</th>
                <th className="text-muted">Status</th>
                <th className="text-muted">Signature</th>
                <th className="text-end">Fee</th>
                <th className="text-muted">Invoked Programs</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, numDisplayed).map((tx, i) => {
                let statusText: string;
                let statusClass: string;
                let signature: React.ReactNode;
                if (tx.meta?.err || !tx.signature) {
                  statusClass = "warning";
                  statusText = "Failed";
                } else {
                  statusClass = "success";
                  statusText = "Success";
                }

                if (tx.signature) {
                  signature = (
                    <Signature
                      signature={tx.signature}
                      link
                      truncateChars={48}
                    />
                  );
                }

                const entries = [...tx.invocations.entries()];
                entries.sort();

                return (
                  <tr key={i}>
                    <td>{tx.index + 1}</td>
                    <td>
                      <span className={`badge bg-${statusClass}-soft`}>
                        {statusText}
                      </span>
                    </td>

                    <td>{signature}</td>

                    <td className="text-end">
                      {tx.meta !== null ? (
                        <Balance daltons={tx.meta.fee} />
                      ) : (
                        "Unknown"
                      )}
                    </td>

                    <td>
                      {tx.invocations.size === 0
                        ? "NA"
                        : entries.map(([programId, count], i) => {
                            return (
                              <div
                                key={i}
                                className="d-flex align-items-center"
                              >
                                <Address
                                  pubkey={new PublicKey(programId)}
                                  link
                                />
                                <span className="ms-2 text-muted">{`(${count})`}</span>
                              </div>
                            );
                          })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
