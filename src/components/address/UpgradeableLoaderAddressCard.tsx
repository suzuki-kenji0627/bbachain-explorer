import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
} from "@mui/material";

// Components
import { Address as AddressComponent } from "components/common/Address";
import { Balance } from "components/common/Balance";
import { Downloadable } from "components/common/Downloadable";
import { UnknownAddressCard } from "./UnknownAddressCard";

// Common
import { Slot } from "components/common/Slot";
import {
  ProgramAccountInfo,
  ProgramBufferAccountInfo,
  ProgramDataAccountInfo,
  UpgradeableLoaderAccount,
} from "validators/accounts/upgradeable-program";

// Hooks
import { useCluster } from "hooks/useCluster";
import { Address, useFetchAddress } from "hooks/useAddress";

// Utils
import { addressLabel } from "utils/tx";
import { CheckingBadge, VerifiedBadge } from "components/common/VerifiedBadge";
import { useVerifiableBuilds } from "utils/program-verification";

export function UpgradeableLoaderAddressCard({
  address,
  parsedData,
  programData,
}: {
  address: Address;
  parsedData: UpgradeableLoaderAccount;
  programData: ProgramDataAccountInfo | undefined;
}) {
  switch (parsedData.type) {
    case "program": {
      return (
        <UpgradeableProgramSection
          address={address}
          programAccount={parsedData.info}
          programData={programData}
        />
      );
    }
    case "programData": {
      return (
        <UpgradeableProgramDataSection
          address={address}
          programData={parsedData.info}
        />
      );
    }
    case "buffer": {
      return (
        <UpgradeableProgramBufferSection
          address={address}
          programBuffer={parsedData.info}
        />
      );
    }
    case "uninitialized": {
      return <UnknownAddressCard address={address} />;
    }
  }
}

export function UpgradeableProgramSection({
  address,
  programAccount,
  programData,
}: {
  address: Address;
  programAccount: ProgramAccountInfo;
  programData: ProgramDataAccountInfo | undefined;
}) {
  const refresh = useFetchAddress();
  const { cluster } = useCluster();
  const label = addressLabel(address.pubkey.toBase58(), cluster);
  const { loading, verifiableBuilds } = useVerifiableBuilds(address.pubkey);

  return (
    <Card
      sx={{
        mb: 2,
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
                {programData === undefined && "Closed "}Program Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  opacity: 0.8,
                }}
              >
                Upgradeable program account details
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label="Program"
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.2)",
                  color: "#8B5CF6",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => refresh(address.pubkey, "parsed")}
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
                }}
              >
                🔄 Refresh
              </Button>
            </Box>
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
                    label={programData !== undefined ? "Yes" : "No"}
                    size="small"
                    color={programData !== undefined ? "success" : "default"}
                    sx={{
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  />
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
                  Executable Data{programData === undefined && " (Closed)"}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  <AddressComponent pubkey={programAccount.programData} link />
                </TableCell>
              </TableRow>
              {programData !== undefined && (
                <>
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
                      Upgradeable
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                        py: 2,
                      }}
                    >
                      <Chip
                        label={programData.authority !== null ? "Yes" : "No"}
                        size="small"
                        color={
                          programData.authority !== null ? "success" : "default"
                        }
                        sx={{
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      />
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
                      Verification Status
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                        py: 2,
                      }}
                    >
                      {loading ? (
                        <CheckingBadge />
                      ) : (
                        <>
                          {verifiableBuilds.map((b, i) => (
                            <VerifiedBadge
                              key={i}
                              verifiableBuild={b}
                              deploySlot={programData.slot}
                            />
                          ))}
                          {verifiableBuilds.length === 0 && (
                            <Chip
                              label="Unverified"
                              size="small"
                              sx={{
                                bgcolor: "rgba(245, 158, 11, 0.2)",
                                color: "#F59E0B",
                                border: "1px solid rgba(245, 158, 11, 0.3)",
                              }}
                            />
                          )}
                        </>
                      )}
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
                      Last Deployed Slot
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                        py: 2,
                      }}
                    >
                      <Slot slot={programData.slot} link />
                    </TableCell>
                  </TableRow>
                  {programData.authority !== null && (
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
                        Upgrade Authority
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          py: 2,
                        }}
                      >
                        <AddressComponent pubkey={programData.authority} link />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export function UpgradeableProgramDataSection({
  address,
  programData,
}: {
  address: Address;
  programData: ProgramDataAccountInfo;
}) {
  const refresh = useFetchAddress();
  return (
    <Card
      sx={{
        mb: 2,
        background:
          "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
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
                Program Executable Data Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  opacity: 0.8,
                }}
              >
                Program executable data information
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label="Data"
                sx={{
                  bgcolor: "rgba(59, 130, 246, 0.2)",
                  color: "#3B82F6",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => refresh(address.pubkey, "parsed")}
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
                }}
              >
                🔄 Refresh
              </Button>
            </Box>
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
                  Balance (BBA)
                </TableCell>
                <TableCell
                  align="right"
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
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    Data Size (Bytes)
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    <Downloadable
                      data={programData.data[0]}
                      filename={`${address.pubkey.toString()}.bin`}
                    >
                      <Typography
                        component="span"
                        sx={{
                          color: "text.primary",
                          fontWeight: 500,
                          mr: 2,
                        }}
                      >
                        {address.space}
                      </Typography>
                    </Downloadable>
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
                  Upgradeable
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  <Chip
                    label={programData.authority !== null ? "Yes" : "No"}
                    size="small"
                    color={
                      programData.authority !== null ? "success" : "default"
                    }
                    sx={{
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  />
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
                  Last Deployed Slot
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                    py: 2,
                  }}
                >
                  <Slot slot={programData.slot} link />
                </TableCell>
              </TableRow>
              {programData.authority !== null && (
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
                    Upgrade Authority
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: 2,
                    }}
                  >
                    <AddressComponent pubkey={programData.authority} link />
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

export function UpgradeableProgramBufferSection({
  address,
  programBuffer,
}: {
  address: Address;
  programBuffer: ProgramBufferAccountInfo;
}) {
  const refresh = useFetchAddress();
  return (
    <Card
      sx={{
        mb: 2,
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
                Program Deploy Buffer Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  opacity: 0.8,
                }}
              >
                Program deployment buffer information
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label="Buffer"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.2)",
                  color: "#10B981",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => refresh(address.pubkey, "parsed")}
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
                🔄 Refresh
              </Button>
            </Box>
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
                  Balance (BBA)
                </TableCell>
                <TableCell
                  align="right"
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
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    Data Size (Bytes)
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
                      {address.space}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {programBuffer.authority !== null && (
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
                    Deploy Authority
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                      py: 2,
                    }}
                  >
                    <AddressComponent pubkey={programBuffer.authority} link />
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
                  Owner
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 2,
                  }}
                >
                  <AddressComponent pubkey={address.owner} link />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
