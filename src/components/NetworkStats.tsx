import { FC, useEffect } from 'react';
import { useFetchSupply, useSupply } from 'hooks/useSupply';
import { ClusterStatus, useCluster } from 'hooks/useCluster';
import { abbreviatedNumber, toBBA } from 'utils';

export const NetworkStats: FC = () => {
  const { status } = useCluster();
  const supply: any = useSupply();
  const fetchSupply = useFetchSupply();

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

