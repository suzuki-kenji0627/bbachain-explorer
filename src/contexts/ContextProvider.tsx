import React, { FC, ReactNode } from 'react';

import { ClusterProvider } from './ClusterProvider';
import { StatsInfoProvider } from './StatsInfoProvider';
import { NetworkConfigurationProvider } from './NetworkConfigurationProvider';

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NetworkConfigurationProvider>
      <ClusterProvider>
        <StatsInfoProvider>
          {children}
        </StatsInfoProvider>
      </ClusterProvider>
    </NetworkConfigurationProvider>
  );
};
