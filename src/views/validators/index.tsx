import { FC, useEffect } from "react";

// Components
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useFetchValidators, useValidators } from "hooks/useValidators";
import { PubKey } from "components/common/PubKey";
import { Epoch } from "components/common/Epoch";
import { ValidatorsStats } from "components/ValidatorsStats";

export const ValidatorsView: FC = () => {
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
    <div className="mx-4">
      <HeadContainer />
      <div className="w-full mb-4">
        <div className="card bg-[#011909] shadow-xl mb-4">
          <div className="card-body">
            <ValidatorsStats />
            <h2 className="card-title">Validators</h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Node Account</th>
                    <th>Vote Account</th>
                    <th>Commision</th>
                    <th>Last Vote Slot</th>
                    <th>Credit</th>
                    <th>Staked</th>
                    <th>Epoch</th>
                  </tr>
                </thead>
                <tbody>
                  {validatorsData.currentValidators.map((validator) => {
                    return (
                      <tr key={validator.nodePubkey}>
                        <td>{}</td>
                        <td>
                          {PubKey({
                            pubkey: validator.nodePubkey,
                            truncateChars: 15,
                            link: true,
                          })}
                        </td>
                        <td>
                          {PubKey({
                            pubkey: validator.votePubkey,
                            truncateChars: 15,
                            link: true,
                          })}
                        </td>
                        <td>{`${validator.commission} %`}</td>
                        <td>{validator.lastVote}</td>
                        <td>{validator.epochCredits[0][1]}</td>
                        <td>{`${validator.activatedStake / 10 ** 9} BBA`}</td>

                        <td>
                          {Epoch({ epoch: validator.epochCredits[0][0] })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
