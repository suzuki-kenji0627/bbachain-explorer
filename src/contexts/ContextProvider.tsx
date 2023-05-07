import React, { FC, ReactNode } from 'react';

import { SupplyProvider } from './SupplyProvider';
import { ClusterProvider } from './ClusterProvider';
import { StatsInfoProvider } from './StatsInfoProvider';
import { BlockchainProvider } from './BlockchainProvider';
import { AutoConnectProvider } from './AutoConnectProvider';
import { NetworkConfigurationProvider } from './NetworkConfigurationProvider';

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClusterProvider>
      <StatsInfoProvider>
        <BlockchainProvider>
          <SupplyProvider>
            <NetworkConfigurationProvider>
              <AutoConnectProvider>
                {children}
              </AutoConnectProvider>
            </NetworkConfigurationProvider>
          </SupplyProvider>
        </BlockchainProvider>
      </StatsInfoProvider>
    </ClusterProvider>
  );
};
