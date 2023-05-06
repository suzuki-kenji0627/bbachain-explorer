import { FC, useEffect } from 'react';
import { SupplyStatus, useFetchSupply, useSupply } from 'hooks/useSupply';
import { ClusterStatus, useCluster } from 'hooks/useCluster';
import { abbreviatedNumber, toBBA } from 'utils';
import { ErrorCard } from './common/ErrorCard';
import { LoadingCard } from './common/LoadingCard';
import { useStatsInfo, useStatsProvider } from 'hooks/useStatsInfo';

export const NetworkStats: FC = () => {
  const { cluster, status } = useCluster();
  const supply: any = useSupply();
  const fetchSupply = useFetchSupply();
  const statsInfo = useStatsInfo();
  const { setActive } = useStatsProvider();

  const { avgSlotTime_1min, epochInfo } = statsInfo;
  const averageSlotTime = Math.round(1000 * avgSlotTime_1min);
  const { blockHeight } = epochInfo;

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
        <div className="stat-value text-justify">{blockHeight}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div className="stat-title">TRANSACTIONS</div>
        <div className="stat-value text-justify">4,195,710 (5 TPS)</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div className="stat-title">EPOCHS</div>
        <div className="stat-value text-justify">2.6M</div>
      </div>
    </div>
  );
};

