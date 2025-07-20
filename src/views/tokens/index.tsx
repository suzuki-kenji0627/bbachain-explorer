import React, { FC, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";
import Link from "next/link";
import { useCluster } from "hooks/useCluster";
import useQueryContext from "hooks/useQueryContext";
import { useTokens, useTokensDispatch, fetchTokens } from "hooks/useTokens";
import { FetchStatus } from "hooks/useCache";

// Simple Search Icon
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Simple Refresh Icon
const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M4 4v6h6M20 20v-6h-6M4 20l5-5 5 5M20 4l-5 5-5-5"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TokensView: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const { cluster, url } = useCluster();
  const { fmtUrlWithCluster } = useQueryContext();
  const tokensData = useTokens();
  const tokensDispatch = useTokensDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    if (url && cluster !== undefined) {
      fetchTokens(tokensDispatch, url, cluster, 20);
    }
  };

  // Show loading placeholder during SSR
  if (!mounted) {
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
            )
          `,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const loading = tokensData?.status === FetchStatus.Fetching;
  const tokens = tokensData?.data?.tokens || [];
  const hasError = tokensData?.status === FetchStatus.FetchFailed;

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.mint.toLowerCase().includes(searchTerm.toLowerCase())
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
      {mounted && (
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    background:
                      "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 700,
                    mb: 2,
                    textShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  Tokens
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      opacity: 0.8,
                      flex: 1,
                    }}
                  >
                    {tokens.length > 0
                      ? `Found ${tokens.length} SPL tokens on the BBAChain blockchain`
                      : "All SPL tokens on the BBAChain blockchain"}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={loading}
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main",
                      "&:hover": {
                        borderColor: "primary.light",
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Box>

                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Search tokens by name, symbol, or mint address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      "& fieldset": {
                        borderColor: "rgba(100, 116, 139, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(245, 158, 11, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#F59E0B",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "text.primary",
                    },
                  }}
                />
              </Box>

              {/* Error State */}
              {hasError && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "error.main", mb: 2 }}>
                    Failed to load tokens
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3 }}
                  >
                    Unable to fetch token data from the blockchain. Please try
                    again.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main",
                    }}
                  >
                    Retry
                  </Button>
                </Box>
              )}

              {/* Loading State */}
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 300,
                  }}
                >
                  <CircularProgress sx={{ color: "primary.main", mb: 2 }} />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Fetching tokens from blockchain...
                  </Typography>
                </Box>
              )}

              {/* Tokens Table */}
              {!loading && !hasError && tokens.length > 0 && (
                <>
                  <TableContainer>
                    <Paper
                      sx={{
                        background: "rgba(30, 41, 59, 0.5)",
                        backdropFilter: "blur(20px)",
                        borderRadius: 2,
                        border: "1px solid rgba(100, 116, 139, 0.2)",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ color: "text.primary", fontWeight: 600 }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              sx={{ color: "text.primary", fontWeight: 600 }}
                            >
                              Token
                            </TableCell>
                            <TableCell
                              sx={{ color: "text.primary", fontWeight: 600 }}
                            >
                              Symbol
                            </TableCell>
                            <TableCell
                              sx={{ color: "text.primary", fontWeight: 600 }}
                            >
                              Supply
                            </TableCell>
                            <TableCell
                              sx={{ color: "text.primary", fontWeight: 600 }}
                            >
                              Decimals
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredTokens.map((token, index) => (
                            <TableRow
                              key={`${token.mint}-${index}`}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                                },
                                borderBottom:
                                  "1px solid rgba(100, 116, 139, 0.2)",
                              }}
                            >
                              <TableCell sx={{ color: "text.secondary" }}>
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Avatar
                                    src={token.logo}
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      backgroundColor: "primary.main",
                                    }}
                                  >
                                    {token.symbol?.[0] || "?"}
                                  </Avatar>
                                  <Box>
                                    <Link
                                      href={fmtUrlWithCluster(
                                        `/token/${token.mint}`
                                      )}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "primary.main",
                                          textDecoration: "none",
                                          fontWeight: 600,
                                          "&:hover": {
                                            textDecoration: "underline",
                                          },
                                        }}
                                      >
                                        {token.name}
                                      </Typography>
                                    </Link>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "text.secondary" }}
                                    >
                                      {token.mint.slice(0, 8)}...
                                      {token.mint.slice(-8)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={token.symbol}
                                  size="small"
                                  sx={{
                                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                                    color: "primary.main",
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ color: "text.secondary" }}>
                                {token.supply
                                  ? parseInt(token.supply).toLocaleString()
                                  : "0"}
                              </TableCell>
                              <TableCell sx={{ color: "text.secondary" }}>
                                {token.decimals}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </TableContainer>

                  {filteredTokens.length === 0 && searchTerm && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        No tokens found matching &quot;{searchTerm}&quot;
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* Empty State */}
              {!loading && !hasError && tokens.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "text.primary", mb: 2 }}
                  >
                    No tokens found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3 }}
                  >
                    No SPL tokens were found on this cluster.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main",
                    }}
                  >
                    Refresh
                  </Button>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};
