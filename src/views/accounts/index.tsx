// Next, React
import { FC, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Components
import { ErrorCard } from "components/common/ErrorCard";
import { HeadContainer } from "components/HeadContainer";
import { LoadingCard } from "components/common/LoadingCard";

// Hooks
import { ClusterStatus, useCluster } from "hooks/useCluster";
import {
  TopAccountState,
  TopAccountStatus,
  useFetchTopAccount,
  useTopAccount,
} from "hooks/useTopAccount";
import { Address } from "components/common/Address";
import { Balance } from "components/common/Balance";

export const AccountsView: FC = ({}) => {
  const { cluster, status } = useCluster();
  const topAccount: TopAccountState = useTopAccount();
  const fetchTopAccount = useFetchTopAccount();

  function fetchData() {
    fetchTopAccount();
  }

  useEffect(() => {
    if (status === ClusterStatus.Connected) {
      fetchData();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (topAccount === TopAccountStatus.Disconnected) {
    // we'll return here to prevent flicker
    return null;
  }

  if (
    topAccount === TopAccountStatus.Idle ||
    topAccount === TopAccountStatus.Connecting
  ) {
    return <LoadingCard message="Loading top accounts data" />;
  } else if (typeof topAccount === "string") {
    return <ErrorCard text={topAccount} retry={fetchData} />;
  }

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Top 20 Richest Accounts
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topAccount.map((account, index) => {
                    return (
                      <TableRow key={account.address.toBase58()}>
                        <TableCell>#{index + 1}</TableCell>
                        <TableCell>
                          <Address pubkey={account.address} link />
                        </TableCell>
                        <TableCell>
                          <Balance daltons={account.daltons} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
