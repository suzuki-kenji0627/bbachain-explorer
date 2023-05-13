import React, { FC } from 'react';
import { PublicKey } from '@bbachain/web3.js';

// Components
import { ErrorCard } from './common/ErrorCard';
import { LoadingCard } from './common/LoadingCard';
import { UnknownAddressCard } from './address/UnknownAddressCard';
import { UpgradeableLoaderAddressCard } from './address/UpgradeableLoaderAddressCard';
import { StakeAddressCard } from './address/StakeAddressCard';
import { VoteAddressCard } from './address/VoteAddressCard';

// Hooks
import { Address, useFetchAddress } from 'hooks/useAddress';
import { CacheEntry, FetchStatus } from 'hooks/useCache';
import { TransactionHistoryCard } from './address/TransactionHistoryCard';

type Props = {
  pubkey: PublicKey;
  info?: CacheEntry<Address>;
}

export const AddressDetail: FC<Props> = ({pubkey, info}) => {
  const fetchAccount = useFetchAddress();

  if (!info || info.status === FetchStatus.Fetching) {
    return <LoadingCard />;
  } else if (
    info.status === FetchStatus.FetchFailed ||
    info.data?.daltons === undefined
  ) {
    return (
      <ErrorCard
        retry={() => fetchAccount(pubkey, "parsed")}
        text="Fetch Failed"
      />
    );
  }

  const address = info.data;

  return (
    <>
      <InfoSection address={address} />
      <TransactionHistoryCard pubkey={pubkey} />
    </>
  );
};

function InfoSection({ address }: { address: Address }) {
  const parsedData = address.data.parsed;
  // const rawData = address.data.raw;

  if (parsedData && parsedData.program === "bpf-upgradeable-loader") {
    return (
      <UpgradeableLoaderAddressCard
        address={address}
        parsedData={parsedData.parsed}
        programData={parsedData.programData}
      />
    );
  } else if (parsedData && parsedData.program === "stake") {
    return (
      <StakeAddressCard
        address={address}
        stakeAccount={parsedData.parsed.info}
        activation={parsedData.activation}
        stakeAccountType={parsedData.parsed.type}
      />
    );
  } else if (parsedData && parsedData.program === "vote") {
    return (
      <VoteAddressCard address={address} voteAccount={parsedData.parsed} />
    );
  } else {
    return (
      <UnknownAddressCard address={address} />
    );
  }
}
