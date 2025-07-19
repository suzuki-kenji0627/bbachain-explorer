import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
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
import { Address, useFetchAddress } from "hooks/useAddress";
import { useCluster } from "hooks/useCluster";

// Utils
import { VoteAccount } from "validators/accounts/vote";
import { addressLabel } from "utils/tx";

export function VoteAddressCard({
  address,
  voteAccount,
}: {
  address: Address;
  voteAccount: VoteAccount;
}) {
  const refresh = useFetchAddress();
  const { cluster } = useCluster();

  const label = addressLabel(address.pubkey.toBase58(), cluster);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2">
            Vote Account
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => refresh(address.pubkey, "parsed")}
          >
            ⟳ Refresh
          </Button>
        </Box>

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
                  <Balance daltons={address.daltons} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Authorized Withdrawer
                </TableCell>
                <TableCell align="right">
                  <AddressComponent
                    pubkey={voteAccount.info.authorizedWithdrawer}
                    link
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Commission
                </TableCell>
                <TableCell align="right">
                  {voteAccount.info.commission}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
