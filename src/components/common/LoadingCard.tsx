import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { BBAIcon } from "./BBAIcon";

interface LoadingCardProps {
  message?: string;
  variant?: "default" | "minimal" | "skeleton";
  showIcon?: boolean;
}

export function LoadingCard({
  message = "Loading",
  variant = "default",
  showIcon = true,
}: LoadingCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (variant === "minimal") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          gap: 2,
        }}
      >
        {showIcon && (
          <BBAIcon size={24} sx={{ animation: "spin 2s linear infinite" }} />
        )}
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {message}...
        </Typography>
      </Box>
    );
  }

  if (variant === "skeleton") {
    return (
      <Card
        sx={{
          width: "100%",
          mb: 2,
          background:
            "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(51, 65, 85, 0.3) 100%)",
          border: "1px solid rgba(100, 116, 139, 0.2)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Skeleton lines */}
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                height: i === 1 ? 24 : i === 2 ? 20 : 16,
                width: i === 1 ? "60%" : i === 2 ? "80%" : "40%",
                backgroundColor: "rgba(100, 116, 139, 0.3)",
                borderRadius: 1,
                mb: 2,
                animation: `skeleton-loading 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                "@keyframes skeleton-loading": {
                  "0%, 100%": {
                    opacity: 0.3,
                  },
                  "50%": {
                    opacity: 0.7,
                  },
                },
              }}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: "100%",
        mb: 2,
        background: `
          linear-gradient(135deg, 
            rgba(30, 64, 175, 0.1) 0%, 
            rgba(139, 92, 246, 0.1) 50%, 
            rgba(6, 214, 160, 0.1) 100%
          )
        `,
        border: "1px solid rgba(100, 116, 139, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)
          `,
          animation: "shimmer 2s infinite",
          "@keyframes shimmer": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        },
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated Icon */}
        {showIcon && (
          <Box sx={{ mb: 2 }}>
            <BBAIcon
              size={isMobile ? 32 : 40}
              sx={{
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-10px)" },
                },
              }}
            />
          </Box>
        )}

        {/* Loading Title */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            background:
              "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06D6A0 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 2,
          }}
        >
          {message}
        </Typography>

        {/* Animated Loading Dots */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          {[1, 2, 3].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                animation: "bounce 1.4s ease-in-out infinite both",
                animationDelay: `${dot * 0.16}s`,
                "@keyframes bounce": {
                  "0%, 80%, 100%": {
                    transform: "scale(0)",
                    opacity: 0.5,
                  },
                  "40%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>

        {/* Loading Progress Bar */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 200,
            mx: "auto",
            height: 3,
            backgroundColor: "rgba(100, 116, 139, 0.3)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "30%",
              background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #06D6A0)",
              borderRadius: 2,
              animation: "loading-bar 2s ease-in-out infinite",
              "@keyframes loading-bar": {
                "0%": { transform: "translateX(-100%)" },
                "50%": { transform: "translateX(250%)" },
                "100%": { transform: "translateX(-100%)" },
              },
            }}
          />
        </Box>

        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "text.secondary",
            opacity: 0.8,
            fontSize: { xs: "0.75rem", md: "0.875rem" },
          }}
        >
          Please wait while we fetch the data...
        </Typography>
      </CardContent>
    </Card>
  );
}
