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
  Chip,
  Link as MuiLink,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
} from "@mui/material";

// Components
import { Slot } from "../common/Slot";
import { BlockHash } from "../common/BlockHash";
import { Balance } from "../common/Balance";
import { Time } from "../common/Time";
import { SkeletonLoader } from "../common/SkeletonLoader";

// Hooks
import { useLatestBlocks } from "hooks/useLatestBlocks";
import { FetchStatus } from "hooks/useCache";

export const LatestBlocks: FC = () => {
  const latestBlocks = useLatestBlocks();
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to format relative time
  const getRelativeTime = (blockTime: number | null) => {
    if (!blockTime) return "Unknown";

    const now = Date.now() / 1000;
    const diff = now - blockTime;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Helper function to get transaction count
  const getTransactionCount = (block: any) => {
    return block.block.transactions?.length || 0;
  };

  // Show loading during SSR to prevent hydration mismatch
  if (!mounted) {
    return <SkeletonLoader variant="table" rows={5} />;
  }

  // Loading state
  if (!latestBlocks) {
    return <SkeletonLoader variant="table" rows={5} />;
  }

  // Error state
  if (latestBlocks && latestBlocks.status === FetchStatus.FetchFailed) {
    return (
      <Card
        sx={{
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: "1px solid rgba(30, 64, 175, 0.2)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Alert severity="error">Failed to load latest blocks</Alert>
        </CardContent>
      </Card>
    );
  }

  // No data yet
  if (!latestBlocks.data?.blocks || latestBlocks.data.blocks.length === 0) {
    return (
      <Card
        sx={{
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: "1px solid rgba(30, 64, 175, 0.2)",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          {latestBlocks && latestBlocks.status === FetchStatus.Fetching ? (
            <SkeletonLoader variant="table" rows={3} />
          ) : (
            <Typography>No blocks available</Typography>
          )}
        </Box>
      </Card>
    );
  }

  const { blocks } = latestBlocks.data;
  const displayBlocks = blocks.slice(0, isMobile ? 5 : 8);

  // Mobile Card Layout
  const MobileBlockCard = ({ block, index }: { block: any; index: number }) => (
    <Box
      key={`${block.block.blockhash}-${index}`}
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
              <Slot slot={block.block.parentSlot} link />
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
              {getRelativeTime(block.block.blockTime)}
            </Typography>
          </Box>
        </Box>

        {/* Hash */}
        <Box>
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
            Hash
          </Typography>
          <BlockHash
            hash={block.block.blockhash}
            truncateChars={16}
            blockNumber={block.block.parentSlot}
            link
          />
        </Box>

        {/* Transactions & Rewards Row */}
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
              Transactions
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontSize: "0.8rem",
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              {getTransactionCount(block)}
            </Typography>
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
              Rewards
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
              <Balance
                daltons={block.block.rewards.reduce(
                  (partialSum, a) => partialSum + a.daltons,
                  0
                )}
              />
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
                bgcolor: "#3B82F6",
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
              🧱 Latest Blocks
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
            Most recent blocks added to the blockchain
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 0 } }}>
          {isMobile ? (
            // Mobile: Card Layout
            <Stack spacing={2}>
              {displayBlocks.map((block, index) => (
                <MobileBlockCard
                  key={`${block.block.blockhash}-${index}`}
                  block={block}
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
                      Hash
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
                      Txns
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
                      Rewards
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
                  {displayBlocks.map((block, index) => {
                    return (
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
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          <Slot slot={block.block.parentSlot} link />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
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
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.primary",
                              fontWeight: 500,
                            }}
                          >
                            {getTransactionCount(block)}
                          </Typography>
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
                              daltons={block.block.rewards.reduce(
                                (partialSum, a) => partialSum + a.daltons,
                                0
                              )}
                            />
                          </Box>
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
                            {getRelativeTime(block.block.blockTime)}
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
          <Link href="/blocks" passHref>
            <MuiLink
              sx={{
                color: "#3B82F6",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: { xs: "0.8rem", md: "0.875rem" },
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#1E40AF",
                  transform: "translateX(4px)",
                },
              }}
            >
              View all blocks →
            </MuiLink>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};
