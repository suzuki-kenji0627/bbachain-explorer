import React, { Dispatch, ReactNode, SetStateAction, createContext, useCallback, useEffect, useReducer, useState } from "react";
import { Connection } from "@bbachain/web3.js";

import { StatsInfoActionType, StatsInfoContext, StatsProviderContext, initialStatsInfo, statsInfoReducer } from "hooks/useStatsInfo";
import { Cluster, useCluster } from "hooks/useCluster";
import { reportError } from "utils/sentry";

// const PERF_UPDATE_SEC = 5;
// const SAMPLE_HISTORY_HOURS = 6;
// const PERFORMANCE_SAMPLE_INTERVAL = 60000;
// const TRANSACTION_COUNT_INTERVAL = 5000;
const EPOCH_INFO_INTERVAL = 2000;
// const BLOCK_TIME_INTERVAL = 5000;
// const LOADING_TIMEOUT = 10000;

function getConnection(url: string): Connection | undefined {
  try {
    return new Connection(url);
  } catch (error) {}
}

type Props = { children: ReactNode };
export function StatsInfoProvider({ children }: Props) {
  const { cluster, url } = useCluster();
  const [active, setActive] = useState(false);

  const [statsInfo, dispatchStatsInfo] = useReducer(
    statsInfoReducer,
    initialStatsInfo
  );

  const setTimedOut = useCallback(() => {
    dispatchStatsInfo({
      type: StatsInfoActionType.SetError,
      data: "Cluster stats timed out",
    });
    console.error("Cluster stats timed out");
    setActive(false);
  }, []);

  const retry = useCallback(() => {
    resetData();
    setActive(true);
  }, []);

  function resetData() {
    dispatchStatsInfo({
      type: StatsInfoActionType.Reset,
      data: initialStatsInfo,
    });
  }

  useEffect(() => {
    console.log(!active, !url);

    if (!active || !url) return;

    const connection = getConnection(url);

    if (!connection) return;

    let lastSlot: number | null = null;

    const getEpochInfo = async () => {
      try {
        const epochInfo = await connection.getEpochInfo();
        lastSlot = epochInfo.absoluteSlot;
        dispatchStatsInfo({
          type: StatsInfoActionType.SetEpochInfo,
          data: epochInfo,
        });
      } catch (error) {
        if (cluster !== Cluster.Custom) {
          reportError(error, { url });
        }
        if (error instanceof Error) {
          dispatchStatsInfo({
            type: StatsInfoActionType.SetError,
            data: error.toString(),
          });
        }
        setActive(false);
      }
    };

    const epochInfoInterval = setInterval(getEpochInfo, EPOCH_INFO_INTERVAL);

    (async () => {
      await getEpochInfo();
    })();

    return () => {
      clearInterval(epochInfoInterval);
    };
  }, [active, cluster, url]);

  return (
    <StatsProviderContext.Provider value={{ setActive, setTimedOut, retry, active }}>
      <StatsInfoContext.Provider value={{ info: statsInfo }}>
        {children}
      </StatsInfoContext.Provider>
    </StatsProviderContext.Provider>
  );
}