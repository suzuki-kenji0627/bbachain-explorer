import React, { FC } from "react";
import bs58 from "bs58";
import { TransactionSignature } from "@bbachain/web3.js";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";

// Components
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";
import { InstructionsSection } from "components/transaction/InstructionsSection";
import { ProgramLogSection } from "components/transaction/ProgramLogSection";
import { TokenBalancesCard } from "components/transaction/TokenBalancesCard";
import { Signature } from "components/common/Signature";
import { Slot } from "components/common/Slot";
import { Time } from "components/common/Time";
import { Balance } from "components/common/Balance";

// Hooks
import { useTransaction, useFetchTransaction } from "hooks/useTransaction";
import {
  useTransactionDetail,
  useFetchTransactionDetail,
} from "hooks/useTransactionDetail";
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";

// Utils & Context
export const SignatureContext = React.createContext("");

// Constants
export const INNER_INSTRUCTIONS_START_SLOT = 46915769;

export type SignatureProps = {
  signature: TransactionSignature;
};

export type AutoRefreshProps = {
  autoRefresh: AutoRefresh;
};

export enum AutoRefresh {
  Active,
  Inactive,
  BailedOut,
}

const AUTO_REFRESH_INTERVAL = 2000;
const ZERO_CONFIRMATION_BAILOUT = 5;

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
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 25%,
            rgba(51, 65, 85, 0.8) 50%,
            rgba(30, 58, 138, 0.7) 75%,
            rgba(79, 70, 229, 0.6) 100%
          ),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)
        `,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%),
            linear-gradient(-45deg, transparent 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)
          `,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: 4,
          py: 3,
        }}
      >
        <HeadContainer />

        <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 4 }}>
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
        </Box>
      </Box>
    </Box>
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
    return <LoadingCard message="Loading transaction status..." />;
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
    statusClass = "error";
    statusText = "Failed";
    if (typeof info.result.err === "object") {
      if ("InstructionError" in info.result.err) {
        errorReason = `Instruction Error (Index ${info.result.err.InstructionError[0]})`;
      } else {
        errorReason = Object.keys(info.result.err)[0];
      }
    } else {
      errorReason = info.result.err;
    }
  }

  const renderConfirmations = () => {
    if (typeof info.confirmations === "number") {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            {info.confirmations}
          </Typography>
          {autoRefresh === AutoRefresh.Active && (
            <CircularProgress size={16} sx={{ color: "primary.main" }} />
          )}
        </Box>
      );
    } else {
      return (
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          max
        </Typography>
      );
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        background:
          "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Transaction Details
          </Typography>
          <Chip
            label={statusText}
            color={statusClass === "success" ? "success" : "error"}
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                    width: "200px",
                  }}
                >
                  Signature
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  <Signature signature={signature} truncateChars={64} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  Slot
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  <Slot slot={info.slot} link />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  Confirmations
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  {renderConfirmations()}
                </TableCell>
              </TableRow>

              {info.confirmationStatus && (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Confirmation Status
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        color: "text.primary",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {info.confirmationStatus}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {info.timestamp !== "unavailable" && (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Block Time
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    <Time timestamp={info.timestamp} />
                  </TableCell>
                </TableRow>
              )}

              {errorReason && (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Error
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "error.main",
                        fontWeight: 500,
                      }}
                    >
                      {errorReason}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
      <TokenBalancesCard signature={signature} />
      <InstructionsSection signature={signature} />
      <ProgramLogSection signature={signature} />
    </>
  );
}
