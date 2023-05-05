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
    <div className="mx-4">
      <div className="w-full hero p-4">
        <div className="hero-content flex flex-col w-2/3">
          <h1 className="text-center text-2xl pl-12 font-bold bg-clip-text mb-4">Block Explorer</h1>
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="">
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">BLOCKS</div>
            <div className="stat-value text-justify">5,000,000</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">TRANSACTIONS</div>
            <div className="stat-value text-justify">4,195,710 (5 TPS)</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">EPOCHS</div>
            <div className="stat-value text-justify">2.6M</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 my-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Latest Blocks</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Block</th>
                    <th>Producer</th>
                    <th>Rewards (BBA)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>
                      <div>
                        <div className="font-bold">5,129,122</div>
                        <div className="text-sm opacity-50">3 seconds ago</div>
                      </div>
                    </th>
                    <td>Mr. Franky</td>
                    <td>0.00350863</td>
                  </tr>
                  <tr>
                    <th>
                      <div>
                        <div className="font-bold">5,129,122</div>
                        <div className="text-sm opacity-50">3 seconds ago</div>
                      </div>
                    </th>
                    <td>Mr. Franky</td>
                    <td>0.00350863</td>
                  </tr>
                  <tr>
                    <th>
                      <div>
                        <div className="font-bold">5,129,122</div>
                        <div className="text-sm opacity-50">3 seconds ago</div>
                      </div>
                    </th>
                    <td>Mr. Franky</td>
                    <td>0.00350863</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Latest Transactions</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>TX Hash</th>
                    <th>Sender/Receiver</th>
                    <th>Amount (BBA)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>
                      <div>
                        <div className="font-bold">datm5oMNsscoyvKEF8...</div>
                        <div className="text-sm opacity-50">3 seconds ago</div>
                      </div>
                    </th>
                    <td>
                      <p>From: EugCFfZL2Ea...</p>
                      <p>To: EugCFfZL2Ea...</p>
                    </td>
                    <td>24.210385935</td>
                  </tr>
                  <tr>
                    <th>
                      <div>
                        <div className="font-bold">datm5oMNsscoyvKEF8...</div>
                        <div className="text-sm opacity-50">3 seconds ago</div>
                      </div>
                    </th>
                    <td>
                      <p>From: EugCFfZL2Ea...</p>
                      <p>To: EugCFfZL2Ea...</p>
                    </td>
                    <td>24.210385935</td>
                  </tr>
                  <tr>
                    <th>
                      <div>
                        <div className="font-bold">datm5oMNsscoyvKEF8...</div>
                        <div className="text-sm opacity-50">3 seconds ago</div>
                      </div>
                    </th>
                    <td>
                      <p>From: EugCFfZL2Ea...</p>
                      <p>To: EugCFfZL2Ea...</p>
                    </td>
                    <td>24.210385935</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
