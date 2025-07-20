// Next, React
import { FC } from "react";
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
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

// Components
import { HeadContainer } from "components/HeadContainer";
import { Slot } from "components/common/Slot";
import { BlockHash } from "components/common/BlockHash";
import { Balance } from "components/common/Balance";
import { Time } from "components/common/Time";

// Hooks
import { useLatestBlocks, useFetchLatestBlocks } from "hooks/useLatestBlocks";
import { FetchStatus } from "hooks/useCache";

export const BlocksView: FC = () => {
  const latestBlocks = useLatestBlocks();
  const fetchLatestBlocks = useFetchLatestBlocks();

  // Load more function
  const loadMore = () => {
    if (latestBlocks && latestBlocks.data?.next) {
      fetchLatestBlocks(latestBlocks.data.next);
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
                "linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
              border: "1px solid rgba(30, 64, 175, 0.2)",
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
                      bgcolor: "#3B82F6",
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
                    🧱 Blocks
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    opacity: 0.8,
                  }}
                >
                  All blocks on the BBAChain blockchain
                </Typography>
              </Box>

              {/* Loading State */}
              {!latestBlocks && (
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
              {latestBlocks &&
                latestBlocks.status === FetchStatus.FetchFailed && (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="error">Failed to load blocks</Alert>
                  </Box>
                )}

              {/* Blocks Table */}
              {latestBlocks && latestBlocks.data && (
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
                            Hash
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
                            Rewards
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
                        {latestBlocks.data.blocks.map((block, index) => (
                          <TableRow
                            key={`${block.block.blockhash}-${index}`}
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
                              <Slot slot={block.block.parentSlot} link />
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom:
                                  "1px solid rgba(100, 116, 139, 0.1)",
                                py: 2,
                              }}
                            >
                              <BlockHash
                                hash={block.block.blockhash}
                                truncateChars={8}
                                blockNumber={block.block.parentSlot}
                                link
                              />
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
                                <Balance
                                  daltons={
                                    Array.isArray(block.block.rewards)
                                      ? block.block.rewards.reduce(
                                          (sum, reward) => sum + reward.daltons,
                                          0
                                        )
                                      : block.block.rewards || 0
                                  }
                                />
                                <Chip
                                  label="BBA"
                                  size="small"
                                  sx={{
                                    height: 16,
                                    fontSize: "0.6rem",
                                    bgcolor: "rgba(6, 214, 160, 0.1)",
                                    color: "#06D6A0",
                                    border: "1px solid rgba(6, 214, 160, 0.2)",
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
                              <Time timestamp={block.block.blockTime} />
                            </TableCell>
                          </TableRow>
                        ))}
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
                        latestBlocks.status === FetchStatus.Fetching ||
                        !latestBlocks.data?.next
                      }
                      sx={{
                        background:
                          "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
                        color: "white",
                        fontWeight: 500,
                        borderRadius: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
                        },
                        "&:disabled": {
                          background: "rgba(100, 116, 139, 0.3)",
                          color: "rgba(255, 255, 255, 0.5)",
                        },
                      }}
                    >
                      {latestBlocks.status === FetchStatus.Fetching ? (
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
