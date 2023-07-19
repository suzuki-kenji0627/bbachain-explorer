import React from "react";

// Components
import { Address as AddressComponent } from "components/common/Address";
import { Balance } from "components/common/Balance";
import { Slot } from "components/common/Slot";

// Hooks
import { Address, useFetchAddress } from "hooks/useAddress";

// Validators
import { VoteAccount } from "validators/accounts/vote";

// Utils
import { displayTimestamp } from "utils/date";

type Props = {
  address: Address;
  voteAccount: VoteAccount;
};

export function VoteAddressCard({ address, voteAccount }: Props) {
  const refresh = useFetchAddress();
  const rootSlot = voteAccount.info.rootSlot;

  return (
    <>
      <div className="card bg-[#011909] shadow-xl mb-4">
        <div className="card-body">
          <h2 className="card-title">Vote Account</h2>
          <button
            className="btn btn-white btn-sm"
            onClick={() => refresh(address.pubkey, "parsed")}
          >
            <span className="fe fe-refresh-cw me-2"></span>
            Refresh
          </button>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <tbody>
                <tr>
                  <td>Address</td>
                  <td className="text-lg-end">
                    <AddressComponent pubkey={address.pubkey} />
                  </td>
                </tr>
                <tr>
                  <td>Balance (BBA)</td>
                  <td className="text-lg-end text-uppercase">
                    <Balance daltons={address.daltons} />
                  </td>
                </tr>
                <tr>
                  <td>
                    Authorized Voter
                    {voteAccount.info.authorizedVoters.length > 1 ? "s" : ""}
                  </td>
                  <td className="text-lg-end">
                    {voteAccount.info.authorizedVoters.map((voter) => {
                      return (
                        <AddressComponent
                          pubkey={voter.authorizedVoter}
                          key={voter.authorizedVoter.toString()}
                          link
                        />
                      );
                    })}
                  </td>
                </tr>

                <tr>
                  <td>Authorized Withdrawer</td>
                  <td className="text-lg-end">
                    <AddressComponent
                      pubkey={voteAccount.info.authorizedWithdrawer}
                      link
                    />
                  </td>
                </tr>

                <tr>
                  <td>Last Timestamp</td>
                  <td className="text-lg-end font-monospace">
                    {displayTimestamp(
                      voteAccount.info.lastTimestamp.timestamp * 1000
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Commission</td>
                  <td className="text-lg-end">
                    {voteAccount.info.commission + "%"}
                  </td>
                </tr>

                <tr>
                  <td>Root Slot</td>
                  <td className="text-lg-end">
                    {rootSlot !== null ? <Slot slot={rootSlot} link /> : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
