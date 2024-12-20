// Next, React
import { FC, useEffect } from "react";

// Components
import { ErrorCard } from "components/common/ErrorCard";
import { HeadContainer } from "components/HeadContainer";
import { LoadingCard } from "components/common/LoadingCard";

// Hooks
import { ClusterStatus, useCluster } from "hooks/useCluster";
import {
  TopAccountState,
  TopAccountStatus,
  useFetchTopAccount,
  useTopAccount,
} from "hooks/useTopAccount";
import { Address } from "components/common/Address";
import { Balance } from "components/common/Balance";

export const AccountsView: FC = ({}) => {
  const { cluster, status } = useCluster();
  const topAccount: TopAccountState = useTopAccount();
  const fetchTopAccount = useFetchTopAccount();

  function fetchData() {
    fetchTopAccount();
  }

  useEffect(() => {
    if (status === ClusterStatus.Connected) {
      fetchData();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (topAccount === TopAccountStatus.Disconnected) {
    // we'll return here to prevent flicker
    return null;
  }

  if (
    topAccount === TopAccountStatus.Idle ||
    topAccount === TopAccountStatus.Connecting
  ) {
    return <LoadingCard message="Loading top accounts data" />;
  } else if (typeof topAccount === "string") {
    return <ErrorCard text={topAccount} retry={fetchData} />;
  }

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        <div className="card bg-[#011909] shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Top 20 Richest Accounts</h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {topAccount.map((account, index) => {
                    return (
                      <tr key={account.address.toBase58()}>
                        <td>
                          <Address pubkey={account.address} link />
                        </td>
                        <td>
                          <Balance daltons={account.daltons} />
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
