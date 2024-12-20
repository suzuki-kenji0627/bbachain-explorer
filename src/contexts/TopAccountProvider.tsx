import React, { ReactNode, useEffect, useState } from "react";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import {
  fetch,
  TopAccountDispatchContext,
  TopAccountState,
  TopAccountStateContext,
  TopAccountStatus,
} from "hooks/useTopAccount";

type Props = { children: ReactNode };
export function TopAccountProvider({ children }: Props) {
  const [state, setState] = useState<TopAccountState>(TopAccountStatus.Idle);
  const { status: clusterStatus, cluster, url } = useCluster();

  useEffect(() => {
    if (state !== TopAccountStatus.Idle) {
      if (clusterStatus === ClusterStatus.Connecting) {
        setState(TopAccountStatus.Disconnected);
      }

      if (clusterStatus === ClusterStatus.Connected) {
        fetch(setState, cluster, url);
      }
    }
  }, [clusterStatus, cluster, url]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TopAccountStateContext.Provider value={state}>
      <TopAccountDispatchContext.Provider value={setState}>
        {children}
      </TopAccountDispatchContext.Provider>
    </TopAccountStateContext.Provider>
  );
}
