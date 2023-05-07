import React, { FC } from "react";

// Components
import { SearchBar } from "components/SearchBar";
import { BlockDetail } from "components/BlockDetail";

type Props = { block: number }

export const BlockDetailView: FC<Props> = ({ block }) => {
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
        <BlockDetail block={block} />
      </div>
    </div>
  );
};
