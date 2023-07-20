import React, { FC } from "react";

// Components
import { Slot } from "components/common/Slot";
import { Epoch } from "components/common/Epoch";
import { Address } from "components/common/Address";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus, useBlock, useFetchBlock } from "hooks/useBlock";
import { ClusterStatus, useCluster } from "hooks/useCluster";

// Utils
import { displayTimestampUtc } from "utils/date";
import { BlockHistoryCard } from "components/BlockHistoryCard";

type Props = { block: number };

export const BlockDetailView: FC<Props> = ({ block }) => {
  const { clusterInfo, status } = useCluster();
  const confirmedBlock = useBlock(block);
  const fetchBlock = useFetchBlock();
  const refresh = () => fetchBlock(block);

  // Fetch block on load
  React.useEffect(() => {
    if (!confirmedBlock && status === ClusterStatus.Connected) refresh();
  }, [block, status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!confirmedBlock || confirmedBlock.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading block" />;
  } else if (
    confirmedBlock.data === undefined ||
    confirmedBlock.status === FetchStatus.FetchFailed
  ) {
    return <ErrorCard retry={refresh} text="Failed to fetch block" />;
  } else if (confirmedBlock.data.block === undefined) {
    return <ErrorCard retry={refresh} text={`Block ${block} was not found`} />;
  }

  const { block: blockData, blockLeader, childSlot } = confirmedBlock.data;
  const epoch = clusterInfo?.epochSchedule.getEpoch(block);

  const showSuccessfulCount = blockData.transactions.every(
    (tx) => tx.meta !== null
  );
  const successfulTxs = blockData.transactions.filter(
    (tx) => tx.meta?.err === null
  );

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        <div className="card bg-[#011909] shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Overview</h2>

            {/* Overview */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <tbody>
                  <tr>
                    <td>Blockhash</td>
                    <td>{blockData.blockhash}</td>
                  </tr>
                  <tr>
                    <td>Block Number</td>
                    <td>{block}</td>
                  </tr>
                  {blockLeader !== undefined && (
                    <tr>
                      <td className="w-100">Proposer</td>
                      <td className="text-lg-end">
                        <Address pubkey={blockLeader} link />
                      </td>
                    </tr>
                  )}
                  {blockData.blockTime ? (
                    <tr>
                      <td>Timestamp (UTC)</td>
                      <td className="text-lg-end">
                        <span className="font-monospace">
                          {displayTimestampUtc(
                            blockData.blockTime * 1000,
                            true
                          )}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="w-100">Timestamp</td>
                      <td className="text-lg-end">Unavailable</td>
                    </tr>
                  )}
                  {epoch !== undefined && (
                    <tr>
                      <td className="w-100">Epoch</td>
                      <td className="text-lg-end font-monospace">
                        <Epoch epoch={epoch} link />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="w-100">Previous Blockhash</td>
                    <td className="text-lg-end font-monospace">
                      <span>{blockData.previousBlockhash}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-100">Previous Block</td>
                    <td className="text-lg-end font-monospace">
                      <Slot slot={blockData.parentSlot} link />
                    </td>
                  </tr>
                  {childSlot !== undefined && (
                    <tr>
                      <td className="w-100">Next Block</td>
                      <td className="text-lg-end font-monospace">
                        <Slot slot={childSlot} link />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="w-100">Transactions</td>
                    <td className="text-lg-end font-monospace">
                      <span>
                        Total success {successfulTxs.length}/
                        {blockData.transactions.length} transactions
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <BlockHistoryCard block={blockData} />
      </div>
    </div>
  );
};
