import { FC, useState, useEffect } from "react";
import Link from "next/link";
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
  Box,
  Link as MuiLink,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
} from "@mui/material";

// Components
import { Slot } from "../common/Slot";
import { Signature } from "../common/Signature";
import { Status } from "../common/Status";
import { Balance } from "../common/Balance";
import { SkeletonLoader } from "../common/SkeletonLoader";

// Hooks
import { useLatestTransactions } from "hooks/useLatestTransactions";
import { FetchStatus } from "hooks/useCache";

// Utils
import { ClientTimestamp } from "components/common/ClientTimestamp";

export const LatestTxs: FC = () => {
  const latestTransactions = useLatestTransactions();
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to calculate transaction value
  const getTransactionValue = (transactionData: any) => {
    if (
      !transactionData.meta ||
      !transactionData.meta.preBalances ||
      !transactionData.meta.postBalances
    ) {
      return 0;
    }
    // Calculate the difference for the first account (usually the sender)
    return Math.abs(
      transactionData.meta.preBalances[0] - transactionData.meta.postBalances[0]
    );
  };

  // Helper function to get transaction fee
  const getTransactionFee = (transactionData: any) => {
    return transactionData.meta?.fee || 0;
  };

  // Helper function to format relative time
  const getRelativeTime = (blockTime: number | null) => {
    if (!blockTime) return "Pending";

    const now = Date.now() / 1000;
    const diff = now - blockTime;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Show loading during SSR to prevent hydration mismatch
  if (!mounted) {
    return <SkeletonLoader variant="table" rows={5} />;
  }

  // Loading state
  if (!latestTransactions) {
    return <SkeletonLoader variant="table" rows={5} />;
  }

  // Error state
  if (
    latestTransactions &&
    latestTransactions.status === FetchStatus.FetchFailed
  ) {
    return (
      <Card
        sx={{
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Alert severity="error">Failed to load latest transactions</Alert>
        </CardContent>
      </Card>
    );
  }

  // No data yet
  if (
    !latestTransactions.data?.transactions ||
    latestTransactions.data.transactions.length === 0
  ) {
    return (
      <Card
        sx={{
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          {latestTransactions &&
          latestTransactions.status === FetchStatus.Fetching ? (
            <SkeletonLoader variant="table" rows={3} />
          ) : (
            <Typography>No transactions available</Typography>
          )}
        </Box>
      </Card>
    );
  }

  const { transactions } = latestTransactions.data;
  const displayTransactions = transactions.slice(0, isMobile ? 5 : 8);

  // Mobile Card Layout
  const MobileTransactionCard = ({
    transactionData,
    index,
  }: {
    transactionData: any;
    index: number;
  }) => (
    <Box
      key={`${transactionData.signature}-${index}`}
      sx={{
        p: 1.5,
        border: "1px solid rgba(100, 116, 139, 0.1)",
        borderRadius: 2,
        background: "rgba(15, 23, 42, 0.2)",
        "&:hover": {
          backgroundColor: "rgba(100, 116, 139, 0.1)",
        },
      }}
    >
      <Stack spacing={1}>
        {/* Signature & Status Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                display: "block",
                mb: 0.5,
              }}
            >
              Signature
            </Typography>
            <Signature
              signature={transactionData.signature}
              link
              truncateChars={12}
            />
          </Box>
          <Box sx={{ textAlign: "right", ml: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                display: "block",
                mb: 0.5,
              }}
            >
              Status
            </Typography>
            <Status confirmations={transactionData.confirmations} />
          </Box>
        </Box>

        {/* Block & Time Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.6rem",
                textTransform: "uppercase",
              }}
            >
              Block
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Slot slot={transactionData.slot || 0} link />
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.6rem",
                textTransform: "uppercase",
              }}
            >
              Time
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                mt: 0.5,
              }}
            >
              {getRelativeTime(transactionData.blockTime)}
            </Typography>
          </Box>
        </Box>

        {/* Value & Fee Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.6rem",
                textTransform: "uppercase",
              }}
            >
              Value
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Balance daltons={getTransactionValue(transactionData)} />
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.6rem",
                textTransform: "uppercase",
              }}
            >
              Fee
            </Typography>
            <Box
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                justifyContent: "flex-end",
              }}
            >
              <Balance daltons={getTransactionFee(transactionData)} />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Card
      sx={{
        height: "100%",
        background:
          "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            background: "rgba(30, 41, 59, 0.5)",
            p: { xs: 2, md: 3 },
            borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#8B5CF6",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              💸 Latest Transactions
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              opacity: 0.8,
              fontSize: { xs: "0.75rem", md: "0.875rem" },
            }}
          >
            Recent transactions processed on the network
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          {isMobile ? (
            // Mobile: Card Layout
            <Stack spacing={2}>
              {displayTransactions.map((transactionData, index) => (
                <MobileTransactionCard
                  key={`${transactionData.signature}-${index}`}
                  transactionData={transactionData}
                  index={index}
                />
              ))}
            </Stack>
          ) : (
            // Desktop: Table Layout
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      Signature
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      Value
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      Fee
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayTransactions.map((transactionData, index) => {
                    return (
                      <TableRow
                        key={`${transactionData.signature}-${index}`}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                          },
                          "&:last-child td": {
                            borderBottom: "none",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          <Signature
                            signature={transactionData.signature}
                            link
                            truncateChars={12}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          <Balance
                            daltons={getTransactionValue(transactionData)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Balance
                              daltons={getTransactionFee(transactionData)}
                            />
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          <Status
                            confirmations={transactionData.confirmations}
                          />
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
                              color: "text.secondary",
                              fontSize: "0.75rem",
                            }}
                          >
                            {getRelativeTime(transactionData.blockTime)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderTop: "1px solid rgba(100, 116, 139, 0.2)",
            textAlign: "center",
            background: "rgba(15, 23, 42, 0.3)",
          }}
        >
          <Link href="/transactions" passHref>
            <MuiLink
              sx={{
                color: "#8B5CF6",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: { xs: "0.8rem", md: "0.875rem" },
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#7C3AED",
                  transform: "translateX(4px)",
                },
              }}
            >
              View all transactions →
            </MuiLink>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};
