import React, { FC, ReactNode } from 'react';

import { SupplyProvider } from './SupplyProvider';
import { ClusterProvider } from './ClusterProvider';
import { StatsInfoProvider } from './StatsInfoProvider';
import { BlockchainProvider } from './BlockchainProvider';
import { AutoConnectProvider } from './AutoConnectProvider';
import { NetworkConfigurationProvider } from './NetworkConfigurationProvider';
import { AddressProvider } from './AddressProvider';

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClusterProvider>
      <SupplyProvider>
        <StatsInfoProvider>
          <BlockchainProvider>
            <AddressProvider>
              <NetworkConfigurationProvider>
                <AutoConnectProvider>
                  {children}
                </AutoConnectProvider>
              </NetworkConfigurationProvider>
            </AddressProvider>
          </BlockchainProvider>
        </StatsInfoProvider>
      </SupplyProvider>
    </ClusterProvider>
  );
};
