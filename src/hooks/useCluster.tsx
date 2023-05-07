import { createContext, useContext } from "react";
import { Connection, EpochInfo, EpochSchedule } from "@bbachain/web3.js";
import { reportError } from "utils/sentry";

export enum Cluster {
  Mainnet,
  Testnet,
  Custom,
}

export enum ClusterStatus {
  Connected,
  Connecting,
  Failure,
}

interface ClusterInfo {
  firstAvailableBlock: number;
  epochSchedule: EpochSchedule;
  epochInfo: EpochInfo;
  genesisHash: string;
}

export interface ClusterState {
  cluster: Cluster;
  customUrl: string;
  clusterInfo?: ClusterInfo;
  status: ClusterStatus;
}

export type ClusterAction = ClusterState;
export type ClusterDispatch = (action: ClusterAction) => void;
export const ClusterDispatchContext = createContext<ClusterDispatch | undefined>(undefined);
export const ClusterStateContext = createContext<ClusterState | undefined>(undefined);

export const MAINNET_URL = "https://api-mainnet.bbachain.com";
export const TESTNET_URL = "https://api-testnet.bbachain.com";

export function clusterUrl(cluster: Cluster, customUrl: string): string {
  switch (cluster) {
    case Cluster.Mainnet:
      return process.env.REACT_APP_MAINNET_RPC_URL ?? MAINNET_URL;
    case Cluster.Testnet:
      return process.env.REACT_APP_TESTNET_RPC_URL ?? TESTNET_URL;
    case Cluster.Custom:
      return customUrl;
  }
}

export function clusterName(cluster: Cluster): string {
  switch (cluster) {
    case Cluster.Mainnet:
      return "Mainnet";
    case Cluster.Testnet:
      return "Testnet";
    case Cluster.Custom:
      return "Custom";
  }
}

export async function updateCluster(
  dispatch: ClusterDispatch,
  cluster: Cluster,
  customUrl: string
) {
  dispatch({
    status: ClusterStatus.Connecting,
    cluster,
    customUrl,
  });

  try {
    // validate url
    new URL(customUrl);

    const connection = new Connection(clusterUrl(cluster, customUrl));
    const [firstAvailableBlock, epochSchedule, epochInfo, genesisHash] =
      await Promise.all([
        connection.getFirstAvailableBlock(),
        connection.getEpochSchedule(),
        connection.getEpochInfo(),
        connection.getGenesisHash(),
      ]);

    dispatch({
      status: ClusterStatus.Connected,
      cluster,
      customUrl,
      clusterInfo: {
        firstAvailableBlock,
        genesisHash,
        epochSchedule,
        epochInfo,
      },
    });
  } catch (error) {
    if (cluster !== Cluster.Custom) {
      reportError(error, { clusterUrl: clusterUrl(cluster, customUrl) });
    }
    dispatch({
      status: ClusterStatus.Failure,
      cluster,
      customUrl,
    });
  }
}

export function useCluster() {
  const context = useContext(ClusterStateContext);
  if (!context) {
    throw new Error(`useCluster must be used within a ClusterProvider`);
  }
  return {
    ...context,
    url: clusterUrl(context.cluster, context.customUrl),
    name: clusterName(context.cluster),
  };
}
