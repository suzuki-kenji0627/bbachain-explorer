import React, { FC, useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { PublicKey, Connection } from "@bbachain/web3.js";
import {
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@bbachain/spl-token-metadata";
import Link from "next/link";
import { useCluster } from "hooks/useCluster";
import useQueryContext from "hooks/useQueryContext";

// Custom SVG icons
const ContentCopyIcon = ({ fontSize = "small" }: { fontSize?: string }) => (
  <svg
    width={fontSize === "small" ? 16 : 20}
    height={fontSize === "small" ? 16 : 20}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const ArrowBackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

interface MintInfo {
  decimals: number;
  supply: string;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  isInitialized: boolean;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  uri?: string;
  website?: string;
  twitter?: string;
  [key: string]: any;
}

interface TokenDetailData {
  mint: MintInfo | null;
  metadata: TokenMetadata | null;
  exists: boolean;
  error?: string;
}

type Props = {
  mint: string;
};

const TokenDetailView: FC<Props> = ({ mint }) => {
  const [data, setData] = useState<TokenDetailData>({
    mint: null,
    metadata: null,
    exists: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { cluster, url } = useCluster();
  const { fmtUrlWithCluster } = useQueryContext();

  // Validate mint address
  let pubkey: PublicKey | null = null;
  try {
    pubkey = new PublicKey(mint);
  } catch (err) {
    // Invalid mint address
  }

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn("Failed to copy to clipboard:", err);
    }
  }, []);

  const fetchTokenData = useCallback(
    async (showRefreshingState = false) => {
      if (!pubkey || !url) return;

      if (showRefreshingState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const connection = new Connection(url, "confirmed");
        console.log(`Fetching token data for ${mint} on ${cluster}`);

        // Check if account exists first
        const accountInfo = await connection.getAccountInfo(pubkey);
        if (!accountInfo) {
          setData({
            mint: null,
            metadata: null,
            exists: false,
            error: "Token mint account not found on this network",
          });
          return;
        }

        // Parse mint account data
        let mintInfo: MintInfo;
        try {
          // Try parsed account info first
          const parsedInfo = await connection.getParsedAccountInfo(pubkey);
          if (parsedInfo.value && "parsed" in parsedInfo.value.data) {
            const parsed = parsedInfo.value.data.parsed;
            if (parsed.type === "mint") {
              mintInfo = {
                decimals: parsed.info.decimals,
                supply: parsed.info.supply,
                mintAuthority: parsed.info.mintAuthority,
                freezeAuthority: parsed.info.freezeAuthority,
                isInitialized: parsed.info.isInitialized,
              };
            } else {
              throw new Error("Account is not a mint");
            }
          } else {
            throw new Error("Cannot parse mint data");
          }
        } catch (parseError) {
          console.warn(
            "Parsed account info failed, using basic parsing:",
            parseError
          );

          // Basic fallback parsing for raw account data
          const data = accountInfo.data;
          if (data.length < 82) {
            throw new Error("Invalid mint account data length");
          }

          // SPL Token Mint layout: https://github.com/solana-labs/solana-program-library/blob/master/token/program/src/state.rs
          const mintAuthorityOption = data[0];
          const mintAuthority =
            mintAuthorityOption === 1
              ? new PublicKey(data.slice(4, 36)).toBase58()
              : null;
          const supply = data.readBigUInt64LE(36).toString();
          const decimals = data[44];
          const isInitialized = data[45] === 1;
          const freezeAuthorityOption = data[46];
          const freezeAuthority =
            freezeAuthorityOption === 1
              ? new PublicKey(data.slice(50, 82)).toBase58()
              : null;

          mintInfo = {
            decimals,
            supply,
            mintAuthority,
            freezeAuthority,
            isInitialized,
          };
        }

        // Fetch metadata if available
        let metadata: TokenMetadata | null = null;
        try {
          const [metadataAddress] = PublicKey.findProgramAddressSync(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              pubkey.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
          );

          const metadataAccount = await Metadata.fromAccountAddress(
            connection,
            metadataAddress
          );
          if (metadataAccount) {
            metadata = {
              name: metadataAccount.data.name.replace(/\0/g, "").trim(),
              symbol: metadataAccount.data.symbol.replace(/\0/g, "").trim(),
              uri: metadataAccount.data.uri.replace(/\0/g, "").trim(),
            };

            // Fetch off-chain metadata if URI exists
            if (metadata.uri) {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const response = await fetch(metadata.uri, {
                  signal: controller.signal,
                  headers: { Accept: "application/json" },
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                  const jsonMetadata = await response.json();
                  metadata = {
                    ...metadata,
                    ...jsonMetadata,
                    description: jsonMetadata.description,
                    image: jsonMetadata.image,
                    website: jsonMetadata.external_url || jsonMetadata.website,
                    twitter:
                      jsonMetadata.twitter || jsonMetadata.properties?.twitter,
                  };
                }
              } catch (uriError) {
                console.warn("Failed to fetch off-chain metadata:", uriError);
              }
            }
          }
        } catch (metadataError) {
          console.warn("No metadata found:", metadataError);
        }

        setData({
          mint: mintInfo,
          metadata,
          exists: true,
        });
      } catch (err) {
        console.error("Error fetching token data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch token data";
        setError(errorMessage);
        setData({
          mint: null,
          metadata: null,
          exists: false,
          error: errorMessage,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pubkey, url, mint, cluster]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && pubkey) {
      fetchTokenData();
    }
  }, [mounted, fetchTokenData]);

  const handleRefresh = () => {
    fetchTokenData(true);
  };

  // Client-side only rendering
  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#f59e0b" }} />
      </Box>
    );
  }

  // Invalid mint address
  if (!pubkey) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "background.paper" }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Invalid mint address: {mint}
          </Alert>
          <Link href={fmtUrlWithCluster("/tokens")} passHref>
            <Button variant="contained" startIcon={<ArrowBackIcon />}>
              Back to Tokens
            </Button>
          </Link>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.95) 25%,
            rgba(51, 65, 85, 0.9) 50%,
            rgba(30, 58, 138, 0.85) 75%,
            rgba(79, 70, 229, 0.8) 100%
          )
        `,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Link href={fmtUrlWithCluster("/tokens")} passHref>
            <IconButton
              sx={{
                color: "rgba(245, 158, 11, 0.8)",
                "&:hover": { color: "#f59e0b" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            Token Details
          </Typography>
          <Chip
            label={cluster}
            size="small"
            sx={{
              bgcolor: "rgba(245, 158, 11, 0.2)",
              color: "#f59e0b",
              textTransform: "capitalize",
            }}
          />
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
            }}
          >
            <CircularProgress sx={{ color: "#f59e0b", mb: 2 }} size={48} />
            <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Loading token information...
            </Typography>
          </Box>
        ) : error || !data.exists ? (
          <Paper
            sx={{ p: 4, textAlign: "center", bgcolor: "rgba(30, 41, 59, 0.8)" }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {data.error || error || "Token not found"}
            </Alert>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
              >
                Mint Address:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  color: "rgba(255, 255, 255, 0.9)",
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                  p: 1,
                  borderRadius: 1,
                  wordBreak: "break-all",
                }}
              >
                {mint}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                disabled={refreshing}
                startIcon={
                  refreshing ? <CircularProgress size={16} /> : <RefreshIcon />
                }
                sx={{ color: "#f59e0b", borderColor: "#f59e0b" }}
              >
                {refreshing ? "Refreshing..." : "Retry"}
              </Button>
              <Link href={fmtUrlWithCluster("/tokens")} passHref>
                <Button variant="contained" startIcon={<ArrowBackIcon />}>
                  Back to Tokens
                </Button>
              </Link>
            </Box>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Token Header Card */}
            <Grid item xs={12}>
              <Card
                sx={{
                  bgcolor: "rgba(30, 41, 59, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(100, 116, 139, 0.3)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item>
                      <Avatar
                        src={data.metadata?.image}
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "#f59e0b",
                          fontSize: "2rem",
                          fontWeight: 700,
                        }}
                      >
                        {data.metadata?.symbol?.[0] || mint[0]}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ color: "white", fontWeight: 700 }}
                        >
                          {data.metadata?.name ||
                            `Token ${mint.slice(0, 8)}...`}
                        </Typography>
                        {data.metadata?.symbol && (
                          <Chip
                            label={data.metadata.symbol}
                            sx={{
                              bgcolor: "rgba(245, 158, 11, 0.2)",
                              color: "#f59e0b",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      {data.metadata?.description && (
                        <Typography
                          variant="body1"
                          sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 2 }}
                        >
                          {data.metadata.description}
                        </Typography>
                      )}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            color: "rgba(255, 255, 255, 0.6)",
                            bgcolor: "rgba(0, 0, 0, 0.2)",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {mint}
                        </Typography>
                        <Tooltip title="Copy address">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(mint)}
                            sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={
                          refreshing ? (
                            <CircularProgress size={16} />
                          ) : (
                            <RefreshIcon />
                          )
                        }
                        onClick={handleRefresh}
                        disabled={refreshing}
                        sx={{
                          color: "#f59e0b",
                          borderColor: "#f59e0b",
                          "&:hover": {
                            borderColor: "#fbbf24",
                            bgcolor: "rgba(245, 158, 11, 0.1)",
                          },
                        }}
                      >
                        {refreshing ? "Refreshing..." : "Refresh"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Token Info */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: "rgba(30, 41, 59, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(100, 116, 139, 0.3)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", mb: 3, fontWeight: 600 }}
                  >
                    Token Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Total Supply
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "white", fontFamily: "monospace" }}
                      >
                        {data.mint
                          ? BigInt(data.mint.supply).toLocaleString()
                          : "0"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Decimals
                      </Typography>
                      <Typography variant="h6" sx={{ color: "white" }}>
                        {data.mint?.decimals ?? 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Status
                      </Typography>
                      <Chip
                        label={
                          data.mint?.isInitialized
                            ? "Initialized"
                            : "Not Initialized"
                        }
                        size="small"
                        color={data.mint?.isInitialized ? "success" : "error"}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Network
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "white", textTransform: "capitalize" }}
                      >
                        {cluster}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Authorities */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: "rgba(30, 41, 59, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(100, 116, 139, 0.3)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", mb: 3, fontWeight: 600 }}
                  >
                    Authorities
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Mint Authority
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: data.mint?.mintAuthority
                              ? "white"
                              : "rgba(255, 255, 255, 0.5)",
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                        >
                          {data.mint?.mintAuthority || "None (Fixed Supply)"}
                        </Typography>
                        {data.mint?.mintAuthority && (
                          <Tooltip title="Copy mint authority">
                            <IconButton
                              size="small"
                              onClick={() =>
                                copyToClipboard(data.mint!.mintAuthority!)
                              }
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ bgcolor: "rgba(100, 116, 139, 0.2)" }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        Freeze Authority
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: data.mint?.freezeAuthority
                              ? "white"
                              : "rgba(255, 255, 255, 0.5)",
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                        >
                          {data.mint?.freezeAuthority ||
                            "None (Cannot be frozen)"}
                        </Typography>
                        {data.mint?.freezeAuthority && (
                          <Tooltip title="Copy freeze authority">
                            <IconButton
                              size="small"
                              onClick={() =>
                                copyToClipboard(data.mint!.freezeAuthority!)
                              }
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Metadata & Links */}
            {(data.metadata?.uri ||
              data.metadata?.website ||
              data.metadata?.twitter) && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    bgcolor: "rgba(30, 41, 59, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(100, 116, 139, 0.3)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", mb: 3, fontWeight: 600 }}
                    >
                      Metadata & Links
                    </Typography>
                    <Grid container spacing={2}>
                      {data.metadata.uri && (
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
                          >
                            Metadata URI
                          </Typography>
                          <Button
                            component="a"
                            href={data.metadata.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            sx={{ color: "#f59e0b", borderColor: "#f59e0b" }}
                          >
                            View JSON
                          </Button>
                        </Grid>
                      )}
                      {data.metadata.website && (
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
                          >
                            Website
                          </Typography>
                          <Button
                            component="a"
                            href={data.metadata.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            sx={{ color: "#f59e0b", borderColor: "#f59e0b" }}
                          >
                            Visit Website
                          </Button>
                        </Grid>
                      )}
                      {data.metadata.twitter && (
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
                          >
                            Twitter
                          </Typography>
                          <Button
                            component="a"
                            href={data.metadata.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            sx={{ color: "#f59e0b", borderColor: "#f59e0b" }}
                          >
                            Follow
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export { TokenDetailView };
