import { useEffect, useReducer } from "react";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";

// Hooks
import {
  Cluster,
  ClusterAction,
  ClusterDispatchContext,
  ClusterState,
  ClusterStateContext,
  ClusterStatus,
  updateCluster,
} from "hooks/useCluster";

// Providers
import { EpochProvider } from "./EpochProvider";
import { BlockProvider } from "./BlockProvider";
import { SupplyProvider } from "./SupplyProvider";
import { AddressProvider } from "./AddressProvider";
import { TransactionProvider } from "./TransactionProvider";
import { LatestBlocksProvider } from "./LatestBlocksProvider";
import { LatestTransactionsProvider } from "./LatestTransactionsProvider";
import { ValidatorsProvider } from "./ValidatorsProvider";
import { TopAccountProvider } from "./TopAccountProvider";
import { TokensProvider } from "./TokensProvider";

// Defines
const DEFAULT_CLUSTER = Cluster.Testnet;
const DEFAULT_CUSTOM_URL = "http://localhost:8899";

function parseQuery(query: ParsedUrlQuery): Cluster {
  const { cluster } = query;
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

function clusterReducer(
  state: ClusterState,
  action: ClusterAction
): ClusterState {
  switch (action.status) {
    case ClusterStatus.Connected:
    case ClusterStatus.Failure: {
      if (
        state.cluster !== action.cluster ||
        state.customUrl !== action.customUrl
      ) {
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
        <SupplyProvider>
          <EpochProvider>
            <BlockProvider>
              <AddressProvider>
                <TransactionProvider>
                  <LatestBlocksProvider>
                    <LatestTransactionsProvider>
                      <ValidatorsProvider>
                        <TopAccountProvider>
                          <TokensProvider>{children}</TokensProvider>
                        </TopAccountProvider>
                      </ValidatorsProvider>
                    </LatestTransactionsProvider>
                  </LatestBlocksProvider>
                </TransactionProvider>
              </AddressProvider>
            </BlockProvider>
          </EpochProvider>
        </SupplyProvider>
      </ClusterDispatchContext.Provider>
    </ClusterStateContext.Provider>
  );
}
