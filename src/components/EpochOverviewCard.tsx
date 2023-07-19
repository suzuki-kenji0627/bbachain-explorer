import React, { FC } from "react";

// Components
import { Epoch } from "./common/Epoch";
import { Slot } from "./common/Slot";
import { LoadingCard } from "./common/LoadingCard";
import { ErrorCard } from "./common/ErrorCard";
import { FetchStatus } from "hooks/useCache";

// Hooks
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useEpoch, useFetchEpoch } from "hooks/useEpoch";

// Utils
import { displayTimestampUtc } from "utils/date";

type Props = {
  epoch: number;
};

export const EpochOverviewCard: FC<Props> = ({ epoch }) => {
  const { status, clusterInfo } = useCluster();

  const epochState = useEpoch(epoch);
  const fetchEpoch = useFetchEpoch();

  // Fetch extra epoch info on load
  React.useEffect(() => {
    if (!clusterInfo) return;
    const { epochInfo, epochSchedule } = clusterInfo;
    const currentEpoch = epochInfo.epoch;
    if (
      epoch <= currentEpoch &&
      !epochState &&
      status === ClusterStatus.Connected
    )
      fetchEpoch(epoch, currentEpoch, epochSchedule);
  }, [epoch, epochState, clusterInfo, status, fetchEpoch]);

  if (!clusterInfo) {
    return <LoadingCard message="Connecting to cluster" />;
  }

  const { epochInfo, epochSchedule } = clusterInfo;
  const currentEpoch = epochInfo.epoch;
  if (epoch > currentEpoch) {
    return <ErrorCard text={`Epoch ${epoch} hasn't started yet`} />;
  } else if (!epochState?.data) {
    if (epochState?.status === FetchStatus.FetchFailed) {
      return <ErrorCard text={`Failed to fetch details for epoch ${epoch}`} />;
    }
    return <LoadingCard message="Loading epoch" />;
  }

  return (
    <div className="card bg-[#011909] shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">
          Overview Epoch <Epoch epoch={epoch} />
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <tbody>
              {epoch > 0 && (
                <tr>
                  <td className="w-100">Previous Epoch</td>
                  <td className="text-lg-end font-monospace">
                    <Epoch epoch={epoch - 1} link />
                  </td>
                </tr>
              )}
              <tr>
                <td className="w-100">Next Epoch</td>
                <td className="text-lg-end font-monospace">
                  {currentEpoch > epoch ? (
                    <Epoch epoch={epoch + 1} link />
                  ) : (
                    <span className="text-muted">Epoch in progress</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-100">First Block</td>
                <td className="text-lg-end font-monospace">
                  <Slot slot={epochState.data.firstBlock} link />
                </td>
              </tr>
              {epochState.data.firstTimestamp && (
                <tr>
                  <td className="w-100">First Block Timestamp</td>
                  <td className="text-lg-end">
                    <span className="font-monospace">
                      {displayTimestampUtc(
                        epochState.data.firstTimestamp * 1000,
                        true
                      )}
                    </span>
                  </td>
                </tr>
              )}
              <tr>
                <td className="w-100">Last Block</td>
                <td className="text-lg-end font-monospace">
                  {epochState.data.lastBlock !== undefined ? (
                    <Slot slot={epochState.data.lastBlock} link />
                  ) : (
                    <span className="text-muted">Epoch in progress</span>
                  )}
                </td>
              </tr>
              {epochState.data.lastTimestamp && (
                <tr>
                  <td className="w-100">Last Block Timestamp</td>
                  <td className="text-lg-end">
                    <span className="font-monospace">
                      {displayTimestampUtc(
                        epochState.data.lastTimestamp * 1000,
                        true
                      )}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
