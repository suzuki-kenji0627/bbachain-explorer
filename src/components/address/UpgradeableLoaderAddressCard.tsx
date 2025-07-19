import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
} from "@mui/material";

// Components
import { Address as AddressComponent } from "components/common/Address";
import { Balance } from "components/common/Balance";
import { Downloadable } from "components/common/Downloadable";
import { UnknownAddressCard } from "./UnknownAddressCard";

// Common
import { Slot } from "components/common/Slot";
import {
  ProgramAccountInfo,
  ProgramBufferAccountInfo,
  ProgramDataAccountInfo,
  UpgradeableLoaderAccount,
} from "validators/accounts/upgradeable-program";

// Hooks
import { useCluster } from "hooks/useCluster";
import { Address, useFetchAddress } from "hooks/useAddress";

// Utils
import { addressLabel } from "utils/tx";
import { CheckingBadge, VerifiedBadge } from "components/common/VerifiedBadge";
import { useVerifiableBuilds } from "utils/program-verification";

export function UpgradeableLoaderAddressCard({
  address,
  parsedData,
  programData,
}: {
  address: Address;
  parsedData: UpgradeableLoaderAccount;
  programData: ProgramDataAccountInfo | undefined;
}) {
  switch (parsedData.type) {
    case "program": {
      return (
        <UpgradeableProgramSection
          address={address}
          programAccount={parsedData.info}
          programData={programData}
        />
      );
    }
    case "programData": {
      return (
        <UpgradeableProgramDataSection
          address={address}
          programData={parsedData.info}
        />
      );
    }
    case "buffer": {
      return (
        <UpgradeableProgramBufferSection
          address={address}
          programBuffer={parsedData.info}
        />
      );
    }
    case "uninitialized": {
      return <UnknownAddressCard address={address} />;
    }
  }
}

export function UpgradeableProgramSection({
  address,
  programAccount,
  programData,
}: {
  address: Address;
  programAccount: ProgramAccountInfo;
  programData: ProgramDataAccountInfo | undefined;
}) {
  const refresh = useFetchAddress();
  const { cluster } = useCluster();
  const label = addressLabel(address.pubkey.toBase58(), cluster);
  const { loading, verifiableBuilds } = useVerifiableBuilds(address.pubkey);
  return (
    <Card>
      <CardHeader
        action={
          <Button
            variant="outlined"
            startIcon={<span className="fe fe-refresh-cw me-2"></span>}
            onClick={() => refresh(address.pubkey, "parsed")}
          >
            Refresh
          </Button>
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {programData === undefined && "Closed "}Program Account
          </Box>
        }
      />

      <CardContent>
        <table>
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
            <td className="text-lg-end text-uppercase">
              <Balance daltons={address.daltons} />
            </td>
          </tr>
          <tr>
            <td>Executable</td>
            <td className="text-lg-end">
              {programData !== undefined ? "Yes" : "No"}
            </td>
          </tr>
          <tr>
            <td>Executable Data{programData === undefined && " (Closed)"}</td>
            <td className="text-lg-end">
              <AddressComponent pubkey={programAccount.programData} link />
            </td>
          </tr>
          {programData !== undefined && (
            <>
              <tr>
                <td>Upgradeable</td>
                <td className="text-lg-end">
                  {programData.authority !== null ? "Yes" : "No"}
                </td>
              </tr>
              <tr>
                <td>{/* <LastVerifiedBuildLabel /> */}</td>
                <td className="text-lg-end">
                  {loading ? (
                    <CheckingBadge />
                  ) : (
                    <>
                      {verifiableBuilds.map((b, i) => (
                        <VerifiedBadge
                          key={i}
                          verifiableBuild={b}
                          deploySlot={programData.slot}
                        />
                      ))}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>{/* <SecurityLabel /> */}</td>
                <td className="text-lg-end">
                  {/* <SecurityTXTBadge
                  programData={programData}
                  pubkey={address.pubkey}
                /> */}
                </td>
              </tr>
              <tr>
                <td>Last Deployed Slot</td>
                <td className="text-lg-end">
                  <Slot slot={programData.slot} link />
                </td>
              </tr>
              {programData.authority !== null && (
                <tr>
                  <td>Upgrade Authority</td>
                  <td className="text-lg-end">
                    <AddressComponent pubkey={programData.authority} link />
                  </td>
                </tr>
              )}
            </>
          )}
        </table>
      </CardContent>
    </Card>
  );
}

export function UpgradeableProgramDataSection({
  address,
  programData,
}: {
  address: Address;
  programData: ProgramDataAccountInfo;
}) {
  const refresh = useFetchAddress();
  return (
    <Card>
      <CardHeader
        action={
          <Button
            variant="outlined"
            startIcon={<span className="fe fe-refresh-cw me-2"></span>}
            onClick={() => refresh(address.pubkey, "parsed")}
          >
            Refresh
          </Button>
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            Program Executable Data Account
          </Box>
        }
      />

      <CardContent>
        <table>
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
          {address.space !== undefined && (
            <tr>
              <td>Data Size (Bytes)</td>
              <td className="text-lg-end">
                <Downloadable
                  data={programData.data[0]}
                  filename={`${address.pubkey.toString()}.bin`}
                >
                  <span className="me-2">{address.space}</span>
                </Downloadable>
              </td>
            </tr>
          )}
          <tr>
            <td>Upgradeable</td>
            <td className="text-lg-end">
              {programData.authority !== null ? "Yes" : "No"}
            </td>
          </tr>
          <tr>
            <td>Last Deployed Slot</td>
            <td className="text-lg-end">
              <Slot slot={programData.slot} link />
            </td>
          </tr>
          {programData.authority !== null && (
            <tr>
              <td>Upgrade Authority</td>
              <td className="text-lg-end">
                <AddressComponent pubkey={programData.authority} link />
              </td>
            </tr>
          )}
        </table>
      </CardContent>
    </Card>
  );
}

export function UpgradeableProgramBufferSection({
  address,
  programBuffer,
}: {
  address: Address;
  programBuffer: ProgramBufferAccountInfo;
}) {
  const refresh = useFetchAddress();
  return (
    <Card>
      <CardHeader
        action={
          <Button
            variant="outlined"
            startIcon={<span className="fe fe-refresh-cw me-2"></span>}
            onClick={() => refresh(address.pubkey, "parsed")}
          >
            Refresh
          </Button>
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            Program Deploy Buffer Account
          </Box>
        }
      />

      <CardContent>
        <table>
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
          {address.space !== undefined && (
            <tr>
              <td>Data Size (Bytes)</td>
              <td className="text-lg-end">{address.space}</td>
            </tr>
          )}
          {programBuffer.authority !== null && (
            <tr>
              <td>Deploy Authority</td>
              <td className="text-lg-end">
                <AddressComponent pubkey={programBuffer.authority} link />
              </td>
            </tr>
          )}
          <tr>
            <td>Owner</td>
            <td className="text-lg-end">
              <AddressComponent pubkey={address.owner} link />
            </td>
          </tr>
        </table>
      </CardContent>
    </Card>
  );
}
