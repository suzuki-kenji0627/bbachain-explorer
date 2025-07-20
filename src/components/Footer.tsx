import { FC } from "react";
import Link from "next/link";
import { Box, Typography, Container, Grid, Divider } from "@mui/material";
import useQueryContext from "hooks/useQueryContext";
import { Logo } from "./common/Logo";

export const Footer: FC = () => {
  const { fmtUrlWithCluster } = useQueryContext();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        borderTop: "1px solid rgba(100, 116, 139, 0.2)",
        mt: "auto",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Logo width={180} height={80} href={fmtUrlWithCluster("/")} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                maxWidth: 280,
              }}
            >
              BBAChain Explorer - Your gateway to exploring the BBAChain
              blockchain. View blocks, transactions, addresses, and network
              statistics in real-time.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                mb: 2,
                fontSize: "1rem",
              }}
            >
              Explore
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href={fmtUrlWithCluster("/blocks")}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.light",
                      transition: "color 0.2s ease",
                    },
                  }}
                >
                  Blocks
                </Typography>
              </Link>
              <Link
                href={fmtUrlWithCluster("/transactions")}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.light",
                      transition: "color 0.2s ease",
                    },
                  }}
                >
                  Transactions
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Network Links */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                mb: 2,
                fontSize: "1rem",
              }}
            >
              Network
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href={fmtUrlWithCluster("/validators")}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.light",
                      transition: "color 0.2s ease",
                    },
                  }}
                >
                  Validators
                </Typography>
              </Link>
              <Link
                href={fmtUrlWithCluster("/accounts")}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.light",
                      transition: "color 0.2s ease",
                    },
                  }}
                >
                  Accounts
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                mb: 2,
                fontSize: "1rem",
              }}
            >
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  "&:hover": {
                    color: "primary.light",
                    transition: "color 0.2s ease",
                  },
                }}
              >
                BBAChain Website
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  "&:hover": {
                    color: "primary.light",
                    transition: "color 0.2s ease",
                  },
                }}
              >
                Documentation
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  "&:hover": {
                    color: "primary.light",
                    transition: "color 0.2s ease",
                  },
                }}
              >
                API Guide
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(100, 116, 139, 0.2)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "center" },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © 2025 BBAChain Labs. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 1,
                background:
                  "linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                border: "1px solid rgba(30, 64, 175, 0.2)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "primary.light",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              >
                Blockchain Explorer
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
