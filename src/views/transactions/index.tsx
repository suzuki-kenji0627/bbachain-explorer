// Next, React
import { FC } from "react";
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
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

// Components
import { HeadContainer } from "components/HeadContainer";
import { Slot } from "components/common/Slot";
import { Signature } from "components/common/Signature";
import { Status } from "components/common/Status";
import { Signer } from "components/common/Signer";

// Hooks
import {
  useLatestTransactions,
  useFetchLatestTransactions,
} from "hooks/useLatestTransactions";
import { FetchStatus } from "hooks/useCache";

// Utils
import { displayTimestampUtc } from "utils/date";

export const TransactionsView: FC = () => {
  const latestTransactions = useLatestTransactions();
  const fetchLatestTransactions = useFetchLatestTransactions();

  // Load more function
  const loadMore = () => {
    if (
      latestTransactions &&
      latestTransactions.data?.transactions &&
      latestTransactions.data.transactions.length > 0
    ) {
      const lastTransaction =
        latestTransactions.data.transactions[
          latestTransactions.data.transactions.length - 1
        ];
      fetchLatestTransactions(lastTransaction.slot, 10);
    }
  };

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
          <Card
            sx={{
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
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
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
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    🔄 Transactions
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    opacity: 0.8,
                  }}
                >
                  All transactions on the BBAChain blockchain
                </Typography>
              </Box>

              {/* Loading State */}
              {!latestTransactions && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 300,
                  }}
                >
                  <CircularProgress sx={{ color: "primary.main" }} />
                </Box>
              )}

              {/* Error State */}
              {latestTransactions &&
                latestTransactions.status === FetchStatus.FetchFailed && (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="error">Failed to load transactions</Alert>
                  </Box>
                )}

              {/* Transactions Table */}
              {latestTransactions && latestTransactions.data && (
                <>
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
                              borderBottom:
                                "1px solid rgba(100, 116, 139, 0.2)",
                            }}
                          >
                            Transaction
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.primary",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              borderBottom:
                                "1px solid rgba(100, 116, 139, 0.2)",
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
                              borderBottom:
                                "1px solid rgba(100, 116, 139, 0.2)",
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
                              borderBottom:
                                "1px solid rgba(100, 116, 139, 0.2)",
                            }}
                          >
                            Signer
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.primary",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              borderBottom:
                                "1px solid rgba(100, 116, 139, 0.2)",
                            }}
                          >
                            Time
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {latestTransactions.data.transactions.map(
                          (transactionData, index) => (
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
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
                                  py: 2,
                                }}
                              >
                                <Signature
                                  signature={transactionData.signature}
                                  link
                                  truncateChars={8}
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
                                  py: 2,
                                }}
                              >
                                <Slot slot={transactionData.slot} link />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
                                  py: 2,
                                }}
                              >
                                <Status
                                  confirmations={transactionData.confirmations}
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
                                  py: 2,
                                }}
                              >
                                <Signature
                                  signature={transactionData.signature}
                                  truncateChars={8}
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
                                  py: 2,
                                }}
                              >
                                {transactionData.blockTime && (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {displayTimestampUtc(
                                      transactionData.blockTime * 1000,
                                      true
                                    )}
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Load More Button */}
                  <Box
                    sx={{
                      p: 3,
                      borderTop: "1px solid rgba(100, 116, 139, 0.2)",
                      background: "rgba(15, 23, 42, 0.3)",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={loadMore}
                      disabled={
                        latestTransactions.status === FetchStatus.Fetching ||
                        !latestTransactions.data?.transactions ||
                        latestTransactions.data.transactions.length === 0
                      }
                      sx={{
                        background:
                          "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                        color: "white",
                        fontWeight: 500,
                        borderRadius: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                        },
                        "&:disabled": {
                          background: "rgba(100, 116, 139, 0.3)",
                          color: "rgba(255, 255, 255, 0.5)",
                        },
                      }}
                    >
                      {latestTransactions.status === FetchStatus.Fetching ? (
                        <CircularProgress
                          size={20}
                          sx={{ color: "inherit", mr: 1 }}
                        />
                      ) : null}
                      Load More
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
