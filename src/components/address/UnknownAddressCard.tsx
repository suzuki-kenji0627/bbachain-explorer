import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

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
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Overview
        </Typography>

        {/* Overview */}
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Address
                </TableCell>
                <TableCell align="right">
                  <AddressComponent pubkey={address.pubkey} />
                </TableCell>
              </TableRow>
              {label && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Address Label
                  </TableCell>
                  <TableCell align="right">{label}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell component="th" scope="row">
                  Balance (BBA)
                </TableCell>
                <TableCell align="right">
                  {address.daltons === 0 ? (
                    "Account does not exist"
                  ) : (
                    <Balance daltons={address.daltons} />
                  )}
                </TableCell>
              </TableRow>

              {address.space !== undefined && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Allocated Data Size
                  </TableCell>
                  <TableCell align="right">{address.space} byte(s)</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell component="th" scope="row">
                  Assigned Program Id
                </TableCell>
                <TableCell align="right">
                  <AddressComponent pubkey={address.owner} link />
                </TableCell>
              </TableRow>

              {address.executable && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Executable
                  </TableCell>
                  <TableCell align="right">Yes</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
