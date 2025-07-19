import React, { FC } from "react";
import {
  SystemInstruction,
  SystemProgram,
  TransactionSignature,
} from "@bbachain/web3.js";
import bs58 from "bs58";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableContainer,
  Chip,
  Box,
} from "@mui/material";
import { BigNumber } from "bignumber.js";

// Components
import { Slot } from "components/common/Slot";
import { Address } from "components/common/Address";
import { Balance } from "components/common/Balance";
import { Signature } from "components/common/Signature";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { InfoTooltip } from "components/common/InfoTooltip";
import { BalanceDelta } from "components/common/BalanceDelta";
import { TokenBalancesCard } from "components/transaction/TokenBalancesCard";
import { ProgramLogSection } from "components/transaction/ProgramLogSection";
import { InstructionsSection } from "components/transaction/InstructionsSection";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useFetchTransaction, useTransaction } from "hooks/useTransaction";
import {
  useFetchTransactionDetail,
  useTransactionDetail,
} from "hooks/useTransactionDetail";

// Utils
import { displayTimestamp } from "utils/date";
import { intoTransactionInstruction } from "utils/tx";
import { getTransactionInstructionError } from "utils/program-err";

// Constants
const AUTO_REFRESH_INTERVAL = 2000;
const ZERO_CONFIRMATION_BAILOUT = 5;
export const INNER_INSTRUCTIONS_START_SLOT = 46915769;

// Define
export const SignatureContext = React.createContext("");

enum AutoRefresh {
  Active,
  Inactive,
  BailedOut,
}

export type SignatureProps = {
  signature: TransactionSignature;
};

type AutoRefreshProps = {
  autoRefresh: AutoRefresh;
};

type Props = { tx: string };

export const TxDetailView: FC<Props> = ({ tx }) => {
  let signature: TransactionSignature | undefined;

  try {
    const decoded = bs58.decode(tx);
    if (decoded.length === 64) {
      signature = tx;
    }
  } catch (err) {}

  const status = useTransaction(signature);

  const [zeroConfirmationRetries, setZeroConfirmationRetries] =
    React.useState(0);

  let autoRefresh = AutoRefresh.Inactive;

  if (zeroConfirmationRetries >= ZERO_CONFIRMATION_BAILOUT) {
    autoRefresh = AutoRefresh.BailedOut;
  } else if (status?.data?.info && status.data.info.confirmations !== "max") {
    autoRefresh = AutoRefresh.Active;
  }

  React.useEffect(() => {
    if (
      status?.status === FetchStatus.Fetched &&
      status.data?.info &&
      status.data.info.confirmations === 0
    ) {
      setZeroConfirmationRetries((retries) => retries + 1);
    }
  }, [status]);

  React.useEffect(() => {
    if (
      status?.status === FetchStatus.Fetching &&
      autoRefresh === AutoRefresh.BailedOut
    ) {
      setZeroConfirmationRetries(0);
    }
  }, [status, autoRefresh, setZeroConfirmationRetries]);

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        {signature === undefined ? (
          <ErrorCard text={`Signature "${tx}" is not valid`} />
        ) : (
          <SignatureContext.Provider value={signature}>
            <StatusCard signature={signature} autoRefresh={autoRefresh} />
            <React.Suspense
              fallback={<LoadingCard message="Loading transaction detail" />}
            >
              <DetailSection signature={signature} />
            </React.Suspense>
          </SignatureContext.Provider>
        )}
      </div>
    </div>
  );
};

function StatusCard({
  signature,
  autoRefresh,
}: SignatureProps & AutoRefreshProps) {
  const fetchStatus = useFetchTransaction();
  const status = useTransaction(signature);
  const details = useTransactionDetail(signature);
  const { clusterInfo, status: clusterStatus } = useCluster();

  // Fetch transaction on load
  React.useEffect(() => {
    if (!status && clusterStatus === ClusterStatus.Connected) {
      fetchStatus(signature);
    }
  }, [signature, clusterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect to set and clear interval for auto-refresh
  React.useEffect(() => {
    if (autoRefresh === AutoRefresh.Active) {
      let intervalHandle: NodeJS.Timeout = setInterval(
        () => fetchStatus(signature),
        AUTO_REFRESH_INTERVAL
      );

      return () => {
        clearInterval(intervalHandle);
      };
    }
  }, [autoRefresh, fetchStatus, signature]);

  if (
    !status ||
    (status.status === FetchStatus.Fetching &&
      autoRefresh === AutoRefresh.Inactive)
  ) {
    return <LoadingCard />;
  } else if (status.status === FetchStatus.FetchFailed) {
    return (
      <ErrorCard retry={() => fetchStatus(signature)} text="Fetch Failed" />
    );
  } else if (!status.data?.info) {
    if (clusterInfo && clusterInfo.firstAvailableBlock > 0) {
      return (
        <ErrorCard
          retry={() => fetchStatus(signature)}
          text="Not Found"
          subtext={`Note: Transactions processed before block ${clusterInfo.firstAvailableBlock} are not available at this time`}
        />
      );
    }
    return <ErrorCard retry={() => fetchStatus(signature)} text="Not Found" />;
  }

  const { info } = status.data;

  let statusClass = "success";
  let statusText = "Success";
  let errorReason = undefined;

  if (info.result.err) {
    statusClass = "warning";
    statusText = "Error";
    if (typeof info.result.err === "string") {
      errorReason = `Runtime Error: "${info.result.err}"`;
    } else {
      const programError = getTransactionInstructionError(info.result.err);
      if (programError !== undefined) {
        errorReason = `Program Error: "Instruction #${
          programError.index + 1
        } Failed"`;
      } else {
        errorReason = `Unknown Error: "${JSON.stringify(info.result.err)}"`;
      }
    }
  }

  const transactionWithMeta = details?.data?.transactionWithMeta;
  const fee = transactionWithMeta?.meta?.fee;
  const transaction = transactionWithMeta?.transaction;
  const blockhash = transaction?.message.recentBlockhash;
  const version = transactionWithMeta?.version;
  const isNonce = (() => {
    if (!transaction || transaction.message.instructions.length < 1) {
      return false;
    }

    const ix = intoTransactionInstruction(
      transaction,
      transaction.message.instructions[0]
    );
    return (
      ix &&
      SystemProgram.programId.equals(ix.programId) &&
      SystemInstruction.decodeInstructionType(ix) === "AdvanceNonceAccount"
    );
  })();

  return (
    <Card
      sx={{
        mb: 4,
        background:
          "linear-gradient(135deg, rgba(20, 70, 15, 0.8) 0%, rgba(17, 25, 9, 0.9) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            background: "rgba(0, 0, 0, 0.2)",
            p: 3,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#9945FF",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            📋 Transaction Overview
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Detailed information about this blockchain transaction
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <TableContainer>
            <Table
              sx={{
                "& .MuiTableCell-root": {
                  border: "none",
                  py: 2,
                  "&:first-of-type": {
                    fontWeight: 600,
                    color: "text.secondary",
                    width: "200px",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  },
                  "&:last-of-type": {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  },
                },
              }}
            >
              <tbody>
                <tr>
                  <td>Status</td>
                  <td className="text-lg-end">
                    <h3 className="mb-0">
                      <span className={`badge bg-${statusClass}-soft`}>
                        {statusText}
                      </span>
                    </h3>
                  </td>
                </tr>

                <tr>
                  <td>Signature</td>
                  <td className="text-lg-end">
                    <Signature signature={signature} alignRight />
                  </td>
                </tr>

                {errorReason !== undefined && (
                  <tr>
                    <td>Error</td>
                    <td className="text-lg-end">
                      <h3 className="mb-0">
                        <span className={`badge bg-${statusClass}-soft`}>
                          {errorReason}
                        </span>
                      </h3>
                    </td>
                  </tr>
                )}

                <tr>
                  <td>Confirmation Status</td>
                  <td className="text-lg-end text-uppercase">
                    {info.confirmationStatus || "Unknown"}
                  </td>
                </tr>

                <tr>
                  <td>Confirmations</td>
                  <td className="text-lg-end text-uppercase">
                    {info.confirmations}
                  </td>
                </tr>

                <tr>
                  <td>Slot</td>
                  <td className="text-lg-end">
                    <Slot slot={info.slot} link />
                  </td>
                </tr>

                {blockhash && (
                  <tr>
                    <td>
                      {isNonce ? (
                        "Nonce"
                      ) : (
                        <InfoTooltip text="Transactions use a previously confirmed blockhash as a nonce to prevent double spends">
                          Recent Blockhash
                        </InfoTooltip>
                      )}
                    </td>
                    <td className="text-lg-end">{blockhash}</td>
                  </tr>
                )}

                {fee && (
                  <tr>
                    <td>Fee (BBA)</td>
                    <td className="text-lg-end">
                      <Balance daltons={fee} />
                    </td>
                  </tr>
                )}

                {version !== undefined && (
                  <tr>
                    <td>Transaction Version</td>
                    <td className="text-lg-end text-uppercase">{version}</td>
                  </tr>
                )}

                <tr>
                  <td>Timestamp</td>
                  <td className="text-lg-end">
                    {info.timestamp !== "unavailable" ? (
                      <span className="font-monospace">
                        {displayTimestamp(info.timestamp * 1000)}
                      </span>
                    ) : (
                      <InfoTooltip
                        bottom
                        right
                        text="Timestamps are only available for confirmed blocks"
                      >
                        Unavailable
                      </InfoTooltip>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

function DetailSection({ signature }: SignatureProps) {
  const details = useTransactionDetail(signature);
  const fetchDetails = useFetchTransactionDetail();
  const status = useTransaction(signature);
  const transactionWithMeta = details?.data?.transactionWithMeta;
  const transaction = transactionWithMeta?.transaction;
  const message = transaction?.message;
  const { status: clusterStatus } = useCluster();
  const refreshDetails = () => fetchDetails(signature);

  // Fetch details on load
  React.useEffect(() => {
    if (
      !details &&
      clusterStatus === ClusterStatus.Connected &&
      status?.status === FetchStatus.Fetched
    ) {
      fetchDetails(signature);
    }
  }, [signature, clusterStatus, status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!status?.data?.info) {
    return null;
  } else if (!details || details.status === FetchStatus.Fetching) {
    return <LoadingCard />;
  } else if (details.status === FetchStatus.FetchFailed) {
    return <ErrorCard retry={refreshDetails} text="Failed to fetch details" />;
  } else if (!transactionWithMeta || !message) {
    return <ErrorCard text="Details are not available" />;
  }

  return (
    <>
      <AccountsCard signature={signature} />
      <TokenBalancesCard signature={signature} />
      <InstructionsSection signature={signature} />
      <ProgramLogSection signature={signature} />
    </>
  );
}

function AccountsCard({ signature }: SignatureProps) {
  const details = useTransactionDetail(signature);

  const transactionWithMeta = details?.data?.transactionWithMeta;
  if (!transactionWithMeta) {
    return null;
  }

  const { meta, transaction } = transactionWithMeta;
  const { message } = transaction;

  if (!meta) {
    return <ErrorCard text="Transaction metadata is missing" />;
  }

  const accountRows = message.accountKeys.map((account, index) => {
    const pre = meta.preBalances[index];
    const post = meta.postBalances[index];
    const pubkey = account.pubkey;
    const key = account.pubkey.toBase58();
    const delta = new BigNumber(post).minus(new BigNumber(pre));

    return (
      <tr key={key}>
        <td>{index + 1}</td>
        <td>
          <Address pubkey={pubkey} link />
        </td>
        <td>
          <BalanceDelta delta={delta} isBBA />
        </td>
        <td>
          <Balance daltons={post} />
        </td>
        <td>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {index === 0 && (
              <Chip
                label="Fee Payer"
                color="info"
                size="small"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
            {account.signer && (
              <Chip
                label="Signer"
                color="info"
                size="small"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
            {account.writable && (
              <Chip
                label="Writable"
                color="error"
                size="small"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
            {message.instructions.find((ix) => ix.programId.equals(pubkey)) && (
              <Chip
                label="Program"
                color="warning"
                size="small"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
            {account.source === "lookupTable" && (
              <Chip
                label="Address Table Lookup"
                color="default"
                size="small"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
          </Box>
        </td>
      </tr>
    );
  });

  return (
    <Card
      sx={{
        mb: 4,
        background:
          "linear-gradient(135deg, rgba(17, 25, 9, 0.9) 0%, rgba(20, 70, 15, 0.8) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "#33a382",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            💰 Account Inputs
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Account balances and changes in this transaction
          </Typography>
        </Box>

        <TableContainer>
          <Table
            sx={{
              "& .MuiTableHead-root .MuiTableCell-root": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "none",
              },
              "& .MuiTableBody-root .MuiTableCell-root": {
                border: "none",
                py: 2,
              },
            }}
          >
            <thead>
              <tr>
                <th className="text-muted">#</th>
                <th className="text-muted">Address</th>
                <th className="text-muted">Change (BBA)</th>
                <th className="text-muted">Post Balance (BBA)</th>
                <th className="text-muted">Detail</th>
              </tr>
            </thead>
            <tbody className="list">{accountRows} </tbody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
