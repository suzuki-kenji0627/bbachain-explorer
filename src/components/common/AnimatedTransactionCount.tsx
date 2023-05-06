import React from "react";
import dynamic from 'next/dynamic';

// Hooks
import { PerformanceInfo } from "hooks/common/PerformanceInfo";
import { PERF_UPDATE_SEC } from "contexts/StatsInfoProvider";

const CountUpDynamic = dynamic(
  async () => await import('react-countup'),
  { ssr: false }
);

export function AnimatedTransactionCount({ info }: { info: PerformanceInfo }) {
  const txCountRef = React.useRef(0);
  const countUpRef = React.useRef({ start: 0, period: 0, lastUpdate: 0 });
  const countUp = countUpRef.current;

  const { transactionCount: txCount, avgTps } = info;

  // Track last tx count to reset count up options
  if (txCount !== txCountRef.current) {
    if (countUp.lastUpdate > 0) {
      // Since we overshoot below, calculate the elapsed value
      // and start from there.
      const elapsed = Date.now() - countUp.lastUpdate;
      const elapsedPeriods = elapsed / (PERF_UPDATE_SEC * 1000);
      countUp.start = Math.floor(
        countUp.start + elapsedPeriods * countUp.period
      );

      // if counter gets ahead of actual count, just hold for a bit
      // until txCount catches up (this will sometimes happen when a tab is
      // sent to the background and/or connection drops)
      countUp.period = Math.max(txCount - countUp.start, 1);
    } else {
      // Since this is the first tx count value, estimate the previous
      // tx count in order to have a starting point for our animation
      countUp.period = PERF_UPDATE_SEC * avgTps;
      countUp.start = txCount - countUp.period;
    }
    countUp.lastUpdate = Date.now();
    txCountRef.current = txCount;
  }

  // Overshoot the target tx count in case the next update is delayed
  const COUNT_PERIODS = 3;
  const countUpEnd = countUp.start + COUNT_PERIODS * countUp.period;

  return (
    <CountUpDynamic
      start={countUp.start}
      end={countUpEnd}
      duration={PERF_UPDATE_SEC * COUNT_PERIODS}
      delay={0}
      useEasing={false}
      preserveValue={true}
      separator=","
    />
  );
}
