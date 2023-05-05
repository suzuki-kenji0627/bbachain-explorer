import { createContext, useEffect, useReducer } from "react";
import { Cluster, ClusterAction, ClusterDispatchContext, ClusterState, ClusterStateContext, ClusterStatus, updateCluster } from "hooks/useCluster";

export const DEFAULT_CLUSTER = Cluster.Testnet;
const DEFAULT_CUSTOM_URL = "http://localhost:8899";

function clusterReducer(state: ClusterState, action: ClusterAction): ClusterState {
    switch (action.status) {
      case ClusterStatus.Connected:
      case ClusterStatus.Failure: {
        if (
          state.cluster !== action.cluster ||
          state.customUrl !== action.customUrl
        )
          return state;
        return action;
      }
      case ClusterStatus.Connecting: {
        return action;
      }
    }
  }

type ClusterProviderProps = { children: React.ReactNode };
export function ClusterProvider({ children }: ClusterProviderProps) {
  const [state, dispatch] = useReducer(clusterReducer, {
    cluster: DEFAULT_CLUSTER,
    customUrl: DEFAULT_CUSTOM_URL,
    status: ClusterStatus.Connecting,
  });

  // Reconnect to cluster when params change
  useEffect(() => {
    updateCluster(dispatch, DEFAULT_CLUSTER, DEFAULT_CUSTOM_URL);
  }, []);

  return (
    <ClusterStateContext.Provider value={state}>
      <ClusterDispatchContext.Provider value={dispatch}>
        {children}
      </ClusterDispatchContext.Provider>
    </ClusterStateContext.Provider>
  );
}
