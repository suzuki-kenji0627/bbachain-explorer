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
} from "@mui/material";

// Components
import { Slot } from "../common/Slot";
import { BlockHash } from "../common/BlockHash";
import { Balance } from "../common/Balance";
import { Time } from "../common/Time";

// Hooks
import { useLatestBlocks } from "hooks/useLatestBlocks";
import { FetchStatus } from "hooks/useCache";

export const LatestBlocks: FC = () => {
  const latestBlocks = useLatestBlocks();
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
        <CircularProgress sx={{ color: "primary.main" }} />
      </Card>
    );
  }

  // Loading state
  if (!latestBlocks) {
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
        <CircularProgress sx={{ color: "primary.main" }} />
      </Card>
    );
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
            <>
              <CircularProgress sx={{ color: "primary.main", mb: 2 }} />
              <Typography>Loading latest blocks...</Typography>
            </>
          ) : (
            <Typography>No blocks available</Typography>
          )}
        </Box>
      </Card>
    );
  }

  const { blocks } = latestBlocks.data;

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
            }}
          >
            Most recent blocks added to the blockchain
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
                  Rewards
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blocks.slice(0, 8).map((block, index) => {
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
                      <Box>
                        <Slot slot={block.block.parentSlot} link />
                        <Time timestamp={block.block.blockTime} />
                      </Box>
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Balance
                          daltons={block.block.rewards.reduce(
                            (partialSum, a) => partialSum + a.daltons,
                            0
                          )}
                        />
                        <Chip
                          label="BBA"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            bgcolor: "rgba(6, 214, 160, 0.1)",
                            color: "#06D6A0",
                            border: "1px solid rgba(6, 214, 160, 0.2)",
                          }}
                        />
                      </Box>
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
          <Link href="/blocks" passHref>
            <MuiLink
              sx={{
                color: "#3B82F6",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
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
