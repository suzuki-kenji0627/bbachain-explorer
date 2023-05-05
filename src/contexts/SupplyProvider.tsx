import React, { ReactNode, useEffect, useState } from "react";
import { fetch, SupplyState, SupplyStateContext, SupplyStatus, SupplyDispatchContext } from "hooks/useSupply";
import { ClusterStatus, useCluster } from "hooks/useCluster";

type Props = { children: ReactNode };
export function SupplyProvider({ children }: Props) {
  const [state, setState] = useState<SupplyState>(SupplyStatus.Idle);
  const { status: clusterStatus, cluster, url } = useCluster();

  useEffect(() => {
    if (state !== SupplyStatus.Idle) {
      if (clusterStatus === ClusterStatus.Connecting) {
        setState(SupplyStatus.Disconnected);
      }

      if (clusterStatus === ClusterStatus.Connected) {
        fetch(setState, cluster, url);
      }
    }
  }, [clusterStatus, cluster, url]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SupplyStateContext.Provider value={state}>
      <SupplyDispatchContext.Provider value={setState}>
        {children}
      </SupplyDispatchContext.Provider>
    </SupplyStateContext.Provider>
  );
}