// Next, React
import { FC } from "react";
import { Box } from "@mui/material";

// Components
import { HeadContainer } from "components/HeadContainer";

// Store
import { NetworkStats } from "components/NetworkStats";
import { LatestBlocks } from "components/home/LatestBlocks";
import { LatestTxs } from "components/home/LatestTxs";

export const HomeView: FC = ({}) => {
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
          mx: 4,
          pt: 2,
        }}
      >
        <HeadContainer />
        <NetworkStats />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            my: 4,
            pb: 4,
          }}
        >
          <LatestBlocks />
          <LatestTxs />
        </Box>
      </Box>
    </Box>
  );
};
