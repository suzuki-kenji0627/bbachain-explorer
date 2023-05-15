// Next, React
import { FC } from "react";

// Components
import { HeadContainer } from "components/HeadContainer";

// Store
import { NetworkStats } from "components/NetworkStats";
import { LatestBlocks } from "components/home/LatestBlocks";
import { LatestTxs } from "components/home/LatestTxs";

export const HomeView: FC = ({}) => {
  return (
    <div className="mx-4">
      <HeadContainer />
      <NetworkStats />

      <div className="grid grid-cols-2 gap-2 my-4">
        <LatestBlocks />
        <LatestTxs />
      </div>
    </div>
  );
};
