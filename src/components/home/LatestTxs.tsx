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
} from "@mui/material";

// Components
import { Slot } from "../common/Slot";
import { Signature } from "../common/Signature";
import { Status } from "../common/Status";

// Hooks
import { useLatestTransactions } from "hooks/useLatestTransactions";
import { FetchStatus } from "hooks/useCache";

// Utils
import { ClientTimestamp } from "components/common/ClientTimestamp";

export const LatestTxs: FC = () => {
  const latestTransactions = useLatestTransactions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading during SSR to prevent hydration mismatch
  if (!mounted) {
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
        <CircularProgress sx={{ color: "primary.main" }} />
      </Card>
    );
  }

  // Loading state
  if (!latestTransactions) {
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
        <CircularProgress sx={{ color: "primary.main" }} />
      </Card>
    );
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
            <>
              <CircularProgress sx={{ color: "primary.main", mb: 2 }} />
              <Typography>Loading latest transactions...</Typography>
            </>
          ) : (
            <Typography>No transactions available</Typography>
          )}
        </Box>
      </Card>
    );
  }

  const { transactions } = latestTransactions.data;

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
            p: 3,
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
            }}
          >
            Recent transactions processed on the network
          </Typography>
        </Box>

        {/* Table */}
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
                  Block
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
              {transactions.slice(0, 8).map((transactionData, index) => {
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
                      <Slot slot={transactionData.slot || 0} link />
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                        py: 2,
                      }}
                    >
                      <Status confirmations={transactionData.confirmations} />
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
                        {transactionData.blockTime ? (
                          <ClientTimestamp
                            timestamp={transactionData.blockTime * 1000}
                            utc={true}
                          />
                        ) : (
                          "Pending"
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
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
                fontSize: "0.875rem",
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
