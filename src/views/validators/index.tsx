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
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useFetchValidators, useValidators } from "hooks/useValidators";
import { PubKey } from "components/common/PubKey";
import { Epoch } from "components/common/Epoch";
import { ValidatorsStats } from "components/ValidatorsStats";

export const ValidatorsView: FC = () => {
  const { status } = useCluster();
  const validators = useValidators();
  const fetchValidators = useFetchValidators();
  const refresh = () => fetchValidators();

  // Fetch validators on load
  useEffect(() => {
    if (!validators && status === ClusterStatus.Connected) refresh();
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!validators || validators.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading validators" />;
  } else if (
    validators.data === undefined ||
    validators.status === FetchStatus.FetchFailed
  ) {
    return (
      <ErrorCard retry={() => refresh()} text="Failed to fetch validators" />
    );
  } else if (validators.data.currentValidators.length === 0) {
    return <ErrorCard retry={() => refresh()} text={`No validators found`} />;
  }

  const { data: validatorsData } = validators;

  return (
    <div className="mx-4">
      <HeadContainer />
      <div className="w-full mb-4">
        <Card>
          <CardContent>
            <ValidatorsStats />
            <Typography variant="h5" component="h2" gutterBottom>
              Validators
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Node Account</TableCell>
                    <TableCell>Vote Account</TableCell>
                    <TableCell>Commission</TableCell>
                    <TableCell>Last Vote Slot</TableCell>
                    <TableCell>Credit</TableCell>
                    <TableCell>Staked</TableCell>
                    <TableCell>Epoch</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validatorsData.currentValidators.map((validator, index) => {
                    return (
                      <TableRow key={`${validator.nodePubkey}-${index}`}>
                        <TableCell>{}</TableCell>
                        <TableCell>
                          {PubKey({
                            pubkey: validator.nodePubkey,
                            truncateChars: 15,
                            link: true,
                          })}
                        </TableCell>
                        <TableCell>
                          {PubKey({
                            pubkey: validator.votePubkey,
                            truncateChars: 15,
                            link: true,
                          })}
                        </TableCell>
                        <TableCell>{`${validator.commission} %`}</TableCell>
                        <TableCell>{validator.lastVote}</TableCell>
                        <TableCell>{validator.epochCredits[0][1]}</TableCell>
                        <TableCell>{`${
                          validator.activatedStake / 10 ** 9
                        } BBA`}</TableCell>

                        <TableCell>
                          {Epoch({ epoch: validator.epochCredits[0][0] })}
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
