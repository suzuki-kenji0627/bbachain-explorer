import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

// Components
import { SearchBar } from "./SearchBar";

// Hooks
import useQueryContext from "hooks/useQueryContext";

export const HeadContainer: FC = () => {
  const { fmtUrlWithCluster } = useQueryContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, md: 3 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "90%", md: "66.666%" },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.25rem" },
            fontWeight: 700,
            background:
              "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06D6A0 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: { xs: 2, md: 3 },
            lineHeight: 1.1,
          }}
        >
          BBAChain Explorer
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "0.8rem", md: "0.9rem" },
            maxWidth: "500px",
            mx: "auto",
            opacity: 0.9,
          }}
        >
          Explore blocks, transactions, and accounts on the BBAChain network
        </Typography>

        <SearchBar />
      </Box>
    </Box>
  );
};
