import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
  Chip,
} from "@mui/material";

// Components
import { Address as AddressComponent } from "components/common/Address";
import { Balance } from "components/common/Balance";

// Hooks
import { Address } from "hooks/useAddress";
import { useCluster } from "hooks/useCluster";

// Utils
import { addressLabel } from "utils/tx";

export function UnknownAddressCard({ address }: { address: Address }) {
  const { cluster } = useCluster();

  const label = addressLabel(address.pubkey.toBase58(), cluster);

  return (
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
                Account Overview
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  opacity: 0.8,
                }}
              >
                Account information and details
              </Typography>
            </Box>
            <Chip
              label="Unknown"
              sx={{
                bgcolor: "rgba(59, 130, 246, 0.2)",
                color: "#3B82F6",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            />
          </Box>
        </Box>

        {/* Table */}
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
                  component="th"
                  scope="row"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  Address
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  <AddressComponent pubkey={address.pubkey} />
                </TableCell>
              </TableRow>
              {label && (
                <TableRow
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(100, 116, 139, 0.1)",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    Address Label
                  </TableCell>
                  <TableCell
                    align="right"
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
                      {label}
                    </Typography>
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
                  component="th"
                  scope="row"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  Balance (BBA)
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  {address.daltons === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontStyle: "italic",
                      }}
                    >
                      Account does not exist
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Balance daltons={address.daltons} />
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
                  )}
                </TableCell>
              </TableRow>

              {address.space !== undefined && (
                <TableRow
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(100, 116, 139, 0.1)",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    Allocated Data Size
                  </TableCell>
                  <TableCell
                    align="right"
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
                      {address.space} byte(s)
                    </Typography>
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
                  component="th"
                  scope="row"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  Assigned Program Id
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  <AddressComponent pubkey={address.owner} link />
                </TableCell>
              </TableRow>

              {address.executable && (
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
                    component="th"
                    scope="row"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    Executable
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    <Chip
                      label="Yes"
                      size="small"
                      color="success"
                      sx={{
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    />
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
