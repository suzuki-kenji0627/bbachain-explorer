import React, { FC } from "react";

// Components
import { ErrorCard } from 'components/common/ErrorCard';
import { EpochOverviewCard } from "components/EpochOverviewCard";
import { HeadContainer } from "components/HeadContainer";

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
      <HeadContainer />

      <div className="w-full mb-4">
        {output}
      </div>
    </div>
  );
};
