import React, { FC, ReactNode } from 'react';

import { SupplyProvider } from './SupplyProvider';
import { ClusterProvider } from './ClusterProvider';
import { StatsInfoProvider } from './StatsInfoProvider';
import { BlockchainProvider } from './BlockchainProvider';
import { NetworkConfigurationProvider } from './NetworkConfigurationProvider';
import { AddressProvider } from './AddressProvider';
import { TransactionProvider } from './TransactionProvider';

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClusterProvider>
      <SupplyProvider>
        <StatsInfoProvider>
          <BlockchainProvider>
            <AddressProvider>
              <TransactionProvider>
                <NetworkConfigurationProvider>
                  {children}
                </NetworkConfigurationProvider>
              </TransactionProvider>
            </AddressProvider>
          </BlockchainProvider>
        </StatsInfoProvider>
      </SupplyProvider>
    </ClusterProvider>
  );
};
