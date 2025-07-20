import React, { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  Chip,
} from "@mui/material";

// Components
import { Slot } from "components/common/Slot";
import { Epoch } from "components/common/Epoch";
import { Address } from "components/common/Address";
import { ErrorCard } from "components/common/ErrorCard";
import { LoadingCard } from "components/common/LoadingCard";
import { HeadContainer } from "components/HeadContainer";

// Hooks
import { FetchStatus, useBlock, useFetchBlock } from "hooks/useBlock";
import { ClusterStatus, useCluster } from "hooks/useCluster";

// Utils
import { displayTimestampUtc } from "utils/date";
import { BlockHistoryCard } from "components/BlockHistoryCard";

type Props = { block: number };

export const BlockDetailView: FC<Props> = ({ block }) => {
  const { clusterInfo, status } = useCluster();
  const confirmedBlock = useBlock(block);
  const fetchBlock = useFetchBlock();
  const refresh = () => fetchBlock(block);

  // Fetch block on load
  React.useEffect(() => {
    if (!confirmedBlock && status === ClusterStatus.Connected) refresh();
  }, [block, status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!confirmedBlock || confirmedBlock.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading block" />;
  } else if (
    confirmedBlock.data === undefined ||
    confirmedBlock.status === FetchStatus.FetchFailed
  ) {
    return <ErrorCard retry={refresh} text="Failed to fetch block" />;
  } else if (confirmedBlock.data.block === undefined) {
    return <ErrorCard retry={refresh} text={`Block ${block} was not found`} />;
  }

  const { block: blockData, blockLeader, childSlot } = confirmedBlock.data;
  const epoch = clusterInfo?.epochSchedule.getEpoch(block);

  const showSuccessfulCount = blockData.transactions.every(
    (tx) => tx.meta !== null
  );
  const successfulTxs = blockData.transactions.filter(
    (tx) => tx.meta?.err === null
  );

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
              mb: 2,
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
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 1,
                      }}
                    >
                      🧱 Block #{block}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        opacity: 0.8,
                      }}
                    >
                      Block information and details
                    </Typography>
                  </Box>
                  <Chip
                    label="Block"
                    sx={{
                      bgcolor: "rgba(59, 130, 246, 0.2)",
                      color: "#3B82F6",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                    }}
                  />
                </Box>
              </Box>

              {/* Overview Table */}
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(100, 116, 139, 0.1)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                        }}
                      >
                        Blockhash
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                          fontFamily: "monospace",
                        }}
                      >
                        {blockData.blockhash}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(100, 116, 139, 0.1)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                        }}
                      >
                        Block Number
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                          fontFamily: "monospace",
                        }}
                      >
                        {block}
                      </TableCell>
                    </TableRow>
                    {blockLeader !== undefined && (
                      <TableRow
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          Proposer
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          <Address pubkey={blockLeader} link />
                        </TableCell>
                      </TableRow>
                    )}
                    {blockData.blockTime ? (
                      <TableRow
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          Timestamp (UTC)
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                            fontFamily: "monospace",
                          }}
                        >
                          {displayTimestampUtc(
                            blockData.blockTime * 1000,
                            true
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          Timestamp
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                            color: "text.secondary",
                          }}
                        >
                          Unavailable
                        </TableCell>
                      </TableRow>
                    )}
                    {epoch !== undefined && (
                      <TableRow
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          Epoch
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                            fontFamily: "monospace",
                          }}
                        >
                          <Epoch epoch={epoch} link />
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(100, 116, 139, 0.1)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                        }}
                      >
                        Previous Blockhash
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                          fontFamily: "monospace",
                        }}
                      >
                        {blockData.previousBlockhash}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(100, 116, 139, 0.1)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                        }}
                      >
                        Previous Block
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                          py: 2,
                          fontFamily: "monospace",
                        }}
                      >
                        <Slot slot={blockData.parentSlot} link />
                      </TableCell>
                    </TableRow>
                    {childSlot !== undefined && (
                      <TableRow
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(100, 116, 139, 0.1)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                          }}
                        >
                          Next Block
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                            py: 2,
                            fontFamily: "monospace",
                          }}
                        >
                          <Slot slot={childSlot} link />
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow
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
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          py: 2,
                        }}
                      >
                        Transactions
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          py: 2,
                          fontFamily: "monospace",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography variant="body2">
                            {successfulTxs.length}/
                            {blockData.transactions.length} successful
                          </Typography>
                          <Chip
                            label="TXs"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.65rem",
                              bgcolor: "rgba(139, 92, 246, 0.1)",
                              color: "#8B5CF6",
                              border: "1px solid rgba(139, 92, 246, 0.2)",
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <BlockHistoryCard block={blockData} />
        </Box>
      </Box>
    </Box>
  );
};
