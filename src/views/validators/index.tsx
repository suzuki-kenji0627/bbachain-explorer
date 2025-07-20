// Next, React
import React, { FC, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

// Components
import { ValidatorsStats } from "components/ValidatorsStats";

export const ValidatorsView: FC = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

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
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Validators
        </Typography>

        <ValidatorsStats />

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            sx={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "white",
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
              },
              "&:disabled": {
                background: "rgba(100, 116, 139, 0.3)",
                color: "rgba(255, 255, 255, 0.5)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
