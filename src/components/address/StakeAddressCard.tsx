import React from "react";
import { displayTimestampUtc } from "utils/date";
import { Address as AddressComponent } from "components/common/Address";
import {
  StakeAccountInfo,
  StakeMeta,
  StakeAccountType,
} from "validators/accounts/stake";
import { StakeActivationData } from "@bbachain/web3.js";
import { Epoch } from "components/common/Epoch";
import { Address, useFetchAddress } from "hooks/useAddress";
import { Balance } from "components/common/Balance";

const U64_MAX = BigInt("0xffffffffffffffff");

export function StakeAddressCard({
  address,
  stakeAccount,
  activation,
  stakeAccountType,
}: {
  address: Address;
  stakeAccount: StakeAccountInfo;
  stakeAccountType: StakeAccountType;
  activation?: StakeActivationData;
}) {
  const hideDelegation =
    stakeAccountType !== "delegated" ||
    isFullyInactivated(stakeAccount, activation);
  return (
    <>
      <LockupCard stakeAccount={stakeAccount} />
      <OverviewCard
        address={address}
        stakeAccount={stakeAccount}
        stakeAccountType={stakeAccountType}
        activation={activation}
        hideDelegation={hideDelegation}
      />
      {!hideDelegation && (
        <DelegationCard
          stakeAccount={stakeAccount}
          activation={activation}
          stakeAccountType={stakeAccountType}
        />
      )}
      <AuthoritiesCard meta={stakeAccount.meta} />
    </>
  );
}

function LockupCard({ stakeAccount }: { stakeAccount: StakeAccountInfo }) {
  const unixTimestamp = 1000 * (stakeAccount.meta?.lockup.unixTimestamp || 0);
  if (Date.now() < unixTimestamp) {
    const prettyTimestamp = displayTimestampUtc(unixTimestamp);
    return (
      <div className="alert alert-warning text-center">
        <strong>Account is locked!</strong> Lockup expires on {prettyTimestamp}
      </div>
    );
  } else {
    return null;
  }
}

const TYPE_NAMES = {
  uninitialized: "Uninitialized",
  initialized: "Initialized",
  delegated: "Delegated",
  rewardsPool: "RewardsPool",
};

function displayStatus(
  stakeAccountType: StakeAccountType,
  activation?: StakeActivationData
) {
  let status = TYPE_NAMES[stakeAccountType];
  let activationState = "";
  if (stakeAccountType !== "delegated") {
    status = "Not delegated";
  } else {
    activationState = activation ? `(${activation.state})` : "";
  }

  return [status, activationState].join(" ");
}

function OverviewCard({
  address,
  stakeAccount,
  stakeAccountType,
  activation,
  hideDelegation,
}: {
  address: Address;
  stakeAccount: StakeAccountInfo;
  stakeAccountType: StakeAccountType;
  activation?: StakeActivationData;
  hideDelegation: boolean;
}) {
  const refresh = useFetchAddress();
  return (
    <>
      <div className="card bg-[#011909] shadow-xl mb-4">
        <div className="card-body">
          <h2 className="card-title">Stake Address</h2>
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
                  <td>Rent Reserve (BBA)</td>
                  <td className="text-lg-end">
                    <Balance daltons={stakeAccount.meta.rentExemptReserve} />
                  </td>
                </tr>
                {hideDelegation && (
                  <tr>
                    <td>Status</td>
                    <td className="text-lg-end">
                      {isFullyInactivated(stakeAccount, activation)
                        ? "Not delegated"
                        : displayStatus(stakeAccountType, activation)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function DelegationCard({
  stakeAccount,
  stakeAccountType,
  activation,
}: {
  stakeAccount: StakeAccountInfo;
  stakeAccountType: StakeAccountType;
  activation?: StakeActivationData;
}) {
  let voterPubkey, activationEpoch, deactivationEpoch;
  const delegation = stakeAccount?.stake?.delegation;
  if (delegation) {
    voterPubkey = delegation.voter;
    if (delegation.activationEpoch !== U64_MAX) {
      activationEpoch = delegation.activationEpoch;
    }
    if (delegation.deactivationEpoch !== U64_MAX) {
      deactivationEpoch = delegation.deactivationEpoch;
    }
  }
  const { stake } = stakeAccount;
  return (
    <div className="card bg-[#011909] shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Stake Delegation</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <tbody>
              <tr>
                <td>Status</td>
                <td className="text-lg-end">
                  {displayStatus(stakeAccountType, activation)}
                </td>
              </tr>

              {stake && (
                <>
                  <tr>
                    <td>Delegated Stake (BBA)</td>
                    <td className="text-lg-end">
                      <Balance daltons={stake.delegation.stake} />
                    </td>
                  </tr>

                  {activation && (
                    <>
                      <tr>
                        <td>Active Stake (BBA)</td>
                        <td className="text-lg-end">
                          <Balance daltons={activation.active} />
                        </td>
                      </tr>

                      <tr>
                        <td>Inactive Stake (BBA)</td>
                        <td className="text-lg-end">
                          <Balance daltons={activation.inactive} />
                        </td>
                      </tr>
                    </>
                  )}

                  {voterPubkey && (
                    <tr>
                      <td>Delegated Vote Address</td>
                      <td className="text-lg-end">
                        <AddressComponent pubkey={voterPubkey} link />
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td>Activation Epoch</td>
                    <td className="text-lg-end">
                      {activationEpoch !== undefined ? (
                        <Epoch epoch={activationEpoch} link />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Deactivation Epoch</td>
                    <td className="text-lg-end">
                      {deactivationEpoch !== undefined ? (
                        <Epoch epoch={deactivationEpoch} link />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuthoritiesCard({ meta }: { meta: StakeMeta }) {
  const hasLockup = meta.lockup.unixTimestamp > 0;
  return (
    <>
      <div className="card bg-[#011909] shadow-xl mb-4">
        <div className="card-body">
          <h2 className="card-title">Authorities</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <tbody>
                <tr>
                  <td>Stake Authority Address</td>
                  <td className="text-lg-end">
                    <AddressComponent pubkey={meta.authorized.staker} link />
                  </td>
                </tr>

                <tr>
                  <td>Withdraw Authority Address</td>
                  <td className="text-lg-end">
                    <AddressComponent
                      pubkey={meta.authorized.withdrawer}
                      link
                    />
                  </td>
                </tr>

                {hasLockup && (
                  <tr>
                    <td>Lockup Authority Address</td>
                    <td className="text-lg-end">
                      <AddressComponent pubkey={meta.lockup.custodian} link />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function isFullyInactivated(
  stakeAccount: StakeAccountInfo,
  activation?: StakeActivationData
): boolean {
  const { stake } = stakeAccount;

  if (!stake || !activation) {
    return false;
  }

  const delegatedStake = stake.delegation.stake;
  const inactiveStake = BigInt(activation.inactive);

  return (
    stake.delegation.deactivationEpoch !== U64_MAX &&
    delegatedStake === inactiveStake
  );
}
