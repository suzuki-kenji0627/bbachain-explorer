// Next, React
import { FC } from 'react';

// Components
import { HeadContainer } from 'components/HeadContainer';

// Store
import { NetworkStats } from 'components/NetworkStats';

export const HomeView: FC = ({ }) => {
  return (
    <div className="mx-4">
      <HeadContainer />
      <NetworkStats />

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
                        <div className="font-bold">MNsscoyvKEF8...</div>
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
                        <div className="font-bold">MNsscoyvKEF8...</div>
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
                        <div className="font-bold">MNsscoyvKEF8...</div>
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
