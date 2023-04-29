// Next, React
import { FC, useEffect } from 'react';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { SearchBar } from 'components/SearchBar';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

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

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-0'>
          <h1 className="text-center text-2xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            BBACHAIN Block Explorer
          </h1>
        </div>
        <div className="flex flex-col">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};
