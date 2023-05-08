import { createContext, useEffect, useReducer } from "react";
import { Cluster, ClusterAction, ClusterDispatchContext, ClusterState, ClusterStateContext, ClusterStatus, updateCluster } from "hooks/useCluster";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";

const DEFAULT_CLUSTER = Cluster.Testnet;
const DEFAULT_CUSTOM_URL = "http://localhost:8899";

function parseQuery(query: ParsedUrlQuery): Cluster {
  const { cluster } = query
  switch (cluster) {
    case "custom":
      return Cluster.Custom;
    case "testnet":
      return Cluster.Testnet;
    case "mainnet":
    default:
      return Cluster.Mainnet;
  }
}

function clusterReducer(state: ClusterState, action: ClusterAction): ClusterState {
    switch (action.status) {
      case ClusterStatus.Connected:
      case ClusterStatus.Failure: {
        if (state.cluster !== action.cluster || state.customUrl !== action.customUrl) {
          return state;
        }

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

  const router = useRouter();
  const cluster = parseQuery(router.query);

  // Reconnect to cluster when params change
  useEffect(() => {
    updateCluster(dispatch, cluster, DEFAULT_CUSTOM_URL);
  }, [cluster]);

  return (
    <ClusterStateContext.Provider value={state}>
      <ClusterDispatchContext.Provider value={dispatch}>
        {children}
      </ClusterDispatchContext.Provider>
    </ClusterStateContext.Provider>
  );
}
