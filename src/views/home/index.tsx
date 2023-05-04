// Next, React
import { FC, useEffect } from 'react';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { SearchBar } from 'components/SearchBar';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import Image from 'next/image';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div className="hero p-4">
      <div className="hero-content flex flex-col w-2/3">
        <h1 className="text-center text-2xl pl-12 font-bold text-transparent bg-clip-text mb-4">
          BBACHAIN Block Explorer
        </h1>
        <div className="w-full p-4">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};
