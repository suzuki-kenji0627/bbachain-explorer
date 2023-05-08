import React, { FC, useEffect } from 'react';

// Components
import { ErrorCard } from './common/ErrorCard';
import { LoadingCard } from './common/LoadingCard';

// Hooks
import { ClusterStatus, useCluster } from 'hooks/useCluster';
import { SupplyStatus, useFetchSupply, useSupply } from 'hooks/useSupply';
import { usePerformanceInfo, useStatsInfo, useStatsProvider } from 'hooks/useStatsInfo';
import useQueryContext from 'hooks/useQueryContext';

// Utils
import { abbreviatedNumber, slotsToHumanString, toBBA } from 'utils';
import Link from 'next/link';


export const NetworkStats: FC = () => {
  const {fmtUrlWithCluster} = useQueryContext();
  const { cluster, status } = useCluster();
  const supply: any = useSupply();
  const fetchSupply = useFetchSupply();
  const statsInfo = useStatsInfo();
  const { setActive } = useStatsProvider();

  const performanceInfo = usePerformanceInfo();
  const transactionCount = performanceInfo.transactionCount;

  const { avgSlotTime_1min, avgSlotTime_1h, epochInfo } = statsInfo;
  const averageSlotTime = Math.round(1000 * avgSlotTime_1min);
  const hourlySlotTime = Math.round(1000 * avgSlotTime_1h);

  const { blockHeight, slotIndex, slotsInEpoch } = epochInfo;
  const epochProgress = ((100 * slotIndex) / slotsInEpoch).toFixed(1) + "%";
  const epochTimeRemaining = slotsToHumanString(
    slotsInEpoch - slotIndex,
    hourlySlotTime
  );

  function fetchData() {
    fetchSupply();
  }

  function displayDaltons(value: number) {
    return abbreviatedNumber(toBBA(value));
  }

  useEffect(() => {
    if (status === ClusterStatus.Connected) {
      fetchData();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActive(true);
    return () => setActive(false);
  }, [setActive, cluster]);

  if (supply === SupplyStatus.Disconnected) {
    // we'll return here to prevent flicker
    return null;
  }

  if (supply === SupplyStatus.Idle || supply === SupplyStatus.Connecting) {
    return <LoadingCard message="Loading supply and price data" />;
  } else if (typeof supply === "string") {
    return <ErrorCard text={supply} retry={fetchData} />;
  }

  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div className="stat-title">SUPPLY</div>
        <div className="stat-value text-justify">{displayDaltons(supply.circulating)}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div className="stat-title">BLOCKS ({averageSlotTime}ms)</div>
        <div className="stat-value text-justify">
          <Link href={fmtUrlWithCluster(`/block/${blockHeight}`)}>{blockHeight}</Link>
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div className="stat-title">TRANSACTIONS</div>
        <div className="stat-value text-justify">{transactionCount}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div className="stat-title">{epochInfo.epoch} EPOCHS</div>
        <div className="stat-value text-justify">{epochProgress}</div>
        <div className="stat-desc">{epochTimeRemaining}</div>
      </div>
    </div>
  );
};
