import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';
import useQueryContext from 'hooks/useQueryContext';
import { EndpointTypes } from 'models/types';

const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();
  const {router, changedClusterUrl} = useQueryContext();

  const changeCluster = (value: string) => {
    setNetworkConfiguration(value);
    changedClusterUrl(value as EndpointTypes);
  };

  return (
    <label className="cursor-pointer label">
      <a>Network</a>
      <select
        value={networkConfiguration}
        onChange={(e) => changeCluster(e.target.value)}
        className="select max-w-xs"
      >
        <option value="mainnet">Mainnet</option>
        <option value="testnet">Testnet</option>
        <option value="custom">Custom</option>
      </select>
    </label>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false
})