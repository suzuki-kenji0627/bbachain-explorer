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
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

// Components
import { HeadContainer } from "components/HeadContainer";
import { Address } from "components/common/Address";
import { Balance } from "components/common/Balance";

// Hooks
import {
  useTopAccount,
  useFetchTopAccount,
  TopAccountStatus,
} from "hooks/useTopAccount";

export const AccountsView: FC = () => {
  const topAccounts = useTopAccount();
  const fetchTopAccounts = useFetchTopAccount();

  // Check if loading
  const isLoading = topAccounts === TopAccountStatus.Connecting;
  const isError = typeof topAccounts === "string";
  const hasData = Array.isArray(topAccounts);

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
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 214, 160, 0.1) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
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
                      bgcolor: "#10B981",
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
                    💰 Top Accounts
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    opacity: 0.8,
                  }}
                >
                  Accounts with the highest BBA token balances
                </Typography>
              </Box>

              {/* Loading State */}
              {isLoading && (
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
              {isError && (
                <Box sx={{ p: 3 }}>
                  <Alert
                    severity="error"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={fetchTopAccounts}
                      >
                        Retry
                      </Button>
                    }
                  >
                    {topAccounts}
                  </Alert>
                </Box>
              )}

              {/* Top Accounts Table */}
              {hasData && (
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
                            Rank
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
                            Address
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
                            Balance
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
                            % of Supply
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topAccounts.map((account, index) => {
                          // Calculate percentage of total supply (assuming 1B total supply)
                          const totalSupply = 1000000000; // 1B BBA
                          const percentage = (
                            (account.daltons / 1000000000 / totalSupply) *
                            100
                          ).toFixed(4);

                          return (
                            <TableRow
                              key={`${account.address.toBase58()}-${index}`}
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Chip
                                    label={`#${index + 1}`}
                                    size="small"
                                    sx={{
                                      bgcolor:
                                        index === 0
                                          ? "rgba(251, 191, 36, 0.2)"
                                          : index === 1
                                          ? "rgba(156, 163, 175, 0.2)"
                                          : index === 2
                                          ? "rgba(251, 146, 60, 0.2)"
                                          : "rgba(100, 116, 139, 0.2)",
                                      color:
                                        index === 0
                                          ? "#FBB928"
                                          : index === 1
                                          ? "#9CA3AF"
                                          : index === 2
                                          ? "#FB923C"
                                          : "#64748B",
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
                                  py: 2,
                                }}
                              >
                                <Address pubkey={account.address} link />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
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
                                  <Balance daltons={account.daltons} />
                                  <Chip
                                    label="BBA"
                                    size="small"
                                    sx={{
                                      height: 16,
                                      fontSize: "0.6rem",
                                      bgcolor: "rgba(6, 214, 160, 0.1)",
                                      color: "#06D6A0",
                                      border:
                                        "1px solid rgba(6, 214, 160, 0.2)",
                                    }}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom:
                                    "1px solid rgba(100, 116, 139, 0.1)",
                                  py: 2,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                  }}
                                >
                                  {percentage}%
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Refresh Button */}
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
                      onClick={fetchTopAccounts}
                      sx={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        color: "white",
                        fontWeight: 500,
                        borderRadius: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #059669 0%, #047857 100%)",
                        },
                      }}
                    >
                      🔄 Refresh Data
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
