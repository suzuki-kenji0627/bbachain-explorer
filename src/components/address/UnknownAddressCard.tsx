import React from "react";

// Components
import { Address as AddressComponent } from "components/common/Address";
import { Balance } from "components/common/Balance";

// Hooks
import { Address } from "hooks/useAddress";
import { useCluster } from "hooks/useCluster";

// Utils
import { addressLabel } from "utils/tx";

export function UnknownAddressCard({ address }: { address: Address }) {
  const { cluster } = useCluster();

  const label = addressLabel(address.pubkey.toBase58(), cluster);
  return (
    <div className="card bg-[#011909] shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Overview</h2>

        {/* Overview */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <tbody>
              <tr>
                <td>Address</td>
                <td className="text-lg-end">
                  <AddressComponent pubkey={address.pubkey} />
                </td>
              </tr>
              {label && (
                <tr>
                  <td>Address Label</td>
                  <td className="text-lg-end">{label}</td>
                </tr>
              )}
              <tr>
                <td>Balance (BBA)</td>
                <td className="text-lg-end">
                  {address.daltons === 0 ? (
                    "Account does not exist"
                  ) : (
                    <Balance daltons={address.daltons} />
                  )}
                </td>
              </tr>

              {address.space !== undefined && (
                <tr>
                  <td>Allocated Data Size</td>
                  <td className="text-lg-end">{address.space} byte(s)</td>
                </tr>
              )}

              <tr>
                <td>Assigned Program Id</td>
                <td className="text-lg-end">
                  <AddressComponent pubkey={address.owner} link />
                </td>
              </tr>

              <tr>
                <td>Executable</td>
                <td className="text-lg-end">
                  {address.executable ? "Yes" : "No"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
