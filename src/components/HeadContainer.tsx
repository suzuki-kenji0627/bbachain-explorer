import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Components
import { SearchBar } from './SearchBar';

// Hooks
import useQueryContext from 'hooks/useQueryContext';

export const HeadContainer: FC = () => {
  const {fmtUrlWithCluster} = useQueryContext();

  return (
    <div className="flex w-full p-4 items-center justify-center">
      <div className="flex-col w-2/3">
        <h1 className="text-center text-2xl pl-12 font-bold bg-clip-text mb-4">Block Explorer</h1>
        <SearchBar />
      </div>
    </div>
  );
};
