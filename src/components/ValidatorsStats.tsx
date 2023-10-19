import React, { FC, useEffect } from "react";

// Components
import { Epoch } from "./common/Epoch";
import { ErrorCard } from "./common/ErrorCard";
import { LoadingCard } from "./common/LoadingCard";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";

// Utils
import Link from "next/link";
import { useFetchValidators, useValidators } from "hooks/useValidators";
import { VoteAccountInfo } from "validators/accounts/vote";
import getNodeVersions from "utils/nodes";

export const ValidatorsStats: FC = () => {
  const { status } = useCluster();
  const validators = useValidators();
  const fetchValidators = useFetchValidators();
  const refresh = () => fetchValidators();

  // Fetch validators on load
  useEffect(() => {
    if (!validators && status === ClusterStatus.Connected) refresh();
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!validators || validators.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading validators" />;
  } else if (
    validators.data === undefined ||
    validators.status === FetchStatus.FetchFailed
  ) {
    return (
      <ErrorCard retry={() => refresh()} text="Failed to fetch validators" />
    );
  } else if (validators.data.currentValidators.length === 0) {
    return <ErrorCard retry={() => refresh()} text={`No validators found`} />;
  }

  const { data: validatorsData } = validators;

  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-title">VALIDATORS</div>
        <div className="stat-value text-justify">
          <table className="table w-full">
            <thead>
              <tr>
                <th>CURRENT</th>
                <th>DELINQUENT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{validatorsData.currentValidators.length}</td>
                <td>{validatorsData.delinquentValidators.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">TOTAL STAKED (BBA)</div>
        <div className="stat-value text-justify">
          {(
            validatorsData.currentValidators.reduce(
              (acc: number, validator: any) => acc + validator.activatedStake,
              0
            ) /
            10 ** 9
          ).toFixed(2)}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Nodes</div>
        {getNodeVersions(validatorsData.clusterNodes).map((node) => (
          <div className="stat-value text-justify" key={node[0]}>
            {node[0]}
            {"  - "}
            {node[1]}%
          </div>
        ))}
      </div>
    </div>
  );
};
