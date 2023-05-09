import React, { FC } from "react";

// Components
import { SearchBar } from "components/SearchBar";
import { ErrorCard } from 'components/common/ErrorCard';
import { EpochOverviewCard } from "components/EpochOverviewCard";

type Props = { epoch: string }

export const EpochDetailView: FC<Props> = ({ epoch }) => {
  let output: React.JSX.Element;
  if (isNaN(Number(epoch))) {
    output = <ErrorCard text={`Epoch ${epoch} is not valid`} />;
  } else {
    output = <EpochOverviewCard epoch={Number(epoch)} />;
  }

  return (
    <div className="mx-4">
      <div className="w-full hero p-4">
        <div className="hero-content flex flex-col w-2/3">
          <h1 className="text-center text-2xl pl-12 font-bold bg-clip-text mb-4">Block Explorer</h1>
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="w-full mb-4">
        {output}
      </div>
    </div>
  );
};
