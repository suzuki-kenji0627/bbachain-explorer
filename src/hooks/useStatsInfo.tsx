import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { StatsInfo } from "./common/StatsInfo";
import { PerformanceInfo } from "./common/PerformanceInfo";

export enum ClusterStatsStatus {
  Loading,
  Ready,
  Error,
}

export type BlockTimeInfo = {
  blockTime: number;
  slot: number;
};

type SetActive = Dispatch<SetStateAction<boolean>>;
export const StatsProviderContext = createContext<
  | {
      setActive: SetActive;
      setTimedOut: Function;
      retry: Function;
      active: boolean;
    }
  | undefined
>(undefined);

export function useStatsProvider() {
  const context = useContext(StatsProviderContext);
  if (!context) {
    throw new Error(`useContext must be used within a StatsInfoProvider`);
  }
  return context;
}

type StatsInfoState = { info: StatsInfo };
export const StatsInfoContext = createContext<StatsInfoState | undefined>(undefined);

type PerformanceState = { info: PerformanceInfo };
export const PerformanceContext = createContext<PerformanceState | undefined>(undefined);

export function useStatsInfo() {
  const context = useContext(StatsInfoContext);
  if (!context) {
    throw new Error(`useStatsInfo must be used within a StatsInfoProvider`);
  }
  return context.info;
}

export function usePerformanceInfo() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error(`usePerformanceInfo must be used within a StatsInfoProvider`);
  }
  return context.info;
}
