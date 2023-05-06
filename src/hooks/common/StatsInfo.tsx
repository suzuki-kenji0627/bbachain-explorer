import { EpochInfo, PerfSample } from "@bbachain/web3.js";
import { BlockTimeInfo, ClusterStatsStatus } from "hooks/useStatsInfo";

export type StatsInfo = {
  status: ClusterStatsStatus;
  avgSlotTime_1h: number;
  avgSlotTime_1min: number;
  epochInfo: EpochInfo;
  blockTime?: number;
  lastBlockTime?: BlockTimeInfo;
};

export enum StatsInfoActionType {
  SetPerfSamples,
  SetEpochInfo,
  SetLastBlockTime,
  SetError,
  Reset,
}

export type StatsInfoActionSetPerfSamples = {
  type: StatsInfoActionType.SetPerfSamples;
  data: PerfSample[];
};

export type StatsInfoActionSetEpochInfo = {
  type: StatsInfoActionType.SetEpochInfo;
  data: EpochInfo;
};

export type StatsInfoActionReset = {
  type: StatsInfoActionType.Reset;
  data: StatsInfo;
};

export type StatsInfoActionSetError = {
  type: StatsInfoActionType.SetError;
  data: string;
};

export type StatsInfoActionSetLastBlockTime = {
  type: StatsInfoActionType.SetLastBlockTime;
  data: BlockTimeInfo;
};

export type StatsInfoAction =
  | StatsInfoActionSetPerfSamples
  | StatsInfoActionSetEpochInfo
  | StatsInfoActionReset
  | StatsInfoActionSetError
  | StatsInfoActionSetLastBlockTime;


export const initialStatsInfo: StatsInfo = {
  status: ClusterStatsStatus.Loading,
  avgSlotTime_1h: 0,
  avgSlotTime_1min: 0,
  epochInfo: {
    absoluteSlot: 0,
    blockHeight: 0,
    epoch: 0,
    slotIndex: 0,
    slotsInEpoch: 0,
  },
};

export function statsInfoReducer(
  state: StatsInfo,
  action: StatsInfoAction,
) {
  switch (action.type) {
    case StatsInfoActionType.SetLastBlockTime: {
      const blockTime = state.blockTime || action.data.blockTime;
      return {
        ...state,
        lastBlockTime: action.data,
        blockTime,
      };
    }

    case StatsInfoActionType.SetPerfSamples: {
      if (action.data.length < 1) {
        return state;
      }

      const samples = action.data
        .filter((sample) => {
          return sample.numSlots !== 0;
        })
        .map((sample) => {
          return sample.samplePeriodSecs / sample.numSlots;
        })
        .slice(0, 60);

      const samplesInHour = samples.length < 60 ? samples.length : 60;
      const avgSlotTime_1h =
        samples.reduce((sum: number, cur: number) => {
          return sum + cur;
        }, 0) / samplesInHour;

      const status =
        state.epochInfo.absoluteSlot !== 0
          ? ClusterStatsStatus.Ready
          : ClusterStatsStatus.Loading;

      return {
        ...state,
        avgSlotTime_1h,
        avgSlotTime_1min: samples[0],
        status,
      };
    }

    case StatsInfoActionType.SetEpochInfo: {
      const status =
        state.avgSlotTime_1h !== 0
          ? ClusterStatsStatus.Ready
          : ClusterStatsStatus.Loading;

      let blockTime = state.blockTime;

      // interpolate blocktime based on last known blocktime and average slot time
      if (
        state.lastBlockTime &&
        state.avgSlotTime_1h !== 0 &&
        action.data.absoluteSlot >= state.lastBlockTime.slot
      ) {
        blockTime =
          state.lastBlockTime.blockTime +
          (action.data.absoluteSlot - state.lastBlockTime.slot) *
            Math.floor(state.avgSlotTime_1h * 1000);
      }

      return {
        ...state,
        epochInfo: action.data,
        status,
        blockTime,
      };
    }

    case StatsInfoActionType.SetError:
      return {
        ...state,
        status: ClusterStatsStatus.Error,
      };

    case StatsInfoActionType.Reset:
      return {
        ...action.data,
      };

    default:
      return state;
  }
}