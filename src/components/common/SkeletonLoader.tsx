import React from "react";
import { Box, Card, CardContent, useTheme, useMediaQuery } from "@mui/material";

interface SkeletonLoaderProps {
  variant?: "card" | "table" | "list" | "stats";
  rows?: number;
  height?: number | string;
  width?: number | string;
}

export function SkeletonLoader({
  variant = "card",
  rows = 3,
  height = "auto",
  width = "100%",
}: SkeletonLoaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const skeletonKeyframes = {
    "@keyframes skeleton-pulse": {
      "0%": {
        backgroundColor: "rgba(100, 116, 139, 0.2)",
      },
      "50%": {
        backgroundColor: "rgba(100, 116, 139, 0.4)",
      },
      "100%": {
        backgroundColor: "rgba(100, 116, 139, 0.2)",
      },
    },
  };

  const SkeletonLine = ({
    width: lineWidth = "100%",
    height: lineHeight = 16,
    mb = 1.5,
    delay = 0,
  }: {
    width?: string | number;
    height?: number;
    mb?: number;
    delay?: number;
  }) => (
    <Box
      sx={{
        width: lineWidth,
        height: lineHeight,
        backgroundColor: "rgba(100, 116, 139, 0.3)",
        borderRadius: 1,
        mb,
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
        animationDelay: `${delay}s`,
        ...skeletonKeyframes,
      }}
    />
  );

  if (variant === "stats") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            sx={{
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(51, 65, 85, 0.3) 100%)",
              border: "1px solid rgba(100, 116, 139, 0.2)",
              borderRadius: 3,
              minHeight: 140,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <SkeletonLine width="60%" height={12} delay={i * 0.1} />
                <SkeletonLine width={24} height={24} delay={i * 0.1 + 0.2} />
              </Box>
              <SkeletonLine
                width="80%"
                height={24}
                mb={1}
                delay={i * 0.1 + 0.4}
              />
              <SkeletonLine width="40%" height={12} delay={i * 0.1 + 0.6} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (variant === "table") {
    return (
      <Card
        sx={{
          background:
            "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(51, 65, 85, 0.3) 100%)",
          border: "1px solid rgba(100, 116, 139, 0.2)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Table Header */}
          <Box
            sx={{ p: 2, borderBottom: "1px solid rgba(100, 116, 139, 0.2)" }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
                gap: 2,
              }}
            >
              {(isMobile ? [1, 2] : [1, 2, 3, 4]).map((i) => (
                <SkeletonLine key={i} width="70%" height={12} delay={i * 0.1} />
              ))}
            </Box>
          </Box>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{ p: 2, borderBottom: "1px solid rgba(100, 116, 139, 0.1)" }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
                  gap: 2,
                }}
              >
                {(isMobile ? [1, 2] : [1, 2, 3, 4]).map((i) => (
                  <SkeletonLine
                    key={i}
                    width={i === 1 ? "90%" : "60%"}
                    height={16}
                    delay={rowIndex * 0.1 + i * 0.05}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (variant === "list") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              border: "1px solid rgba(100, 116, 139, 0.2)",
              borderRadius: 2,
              background: "rgba(15, 23, 42, 0.2)",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <SkeletonLine width="30%" height={12} delay={index * 0.1} />
              <SkeletonLine width="20%" height={12} delay={index * 0.1 + 0.1} />
            </Box>
            <SkeletonLine
              width="80%"
              height={16}
              mb={1}
              delay={index * 0.1 + 0.2}
            />
            <SkeletonLine width="60%" height={12} delay={index * 0.1 + 0.3} />
          </Box>
        ))}
      </Box>
    );
  }

  // Default card variant
  return (
    <Card
      sx={{
        width,
        height,
        background:
          "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(51, 65, 85, 0.3) 100%)",
        border: "1px solid rgba(100, 116, 139, 0.2)",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <SkeletonLine width="60%" height={24} mb={2} />
        <SkeletonLine width="100%" height={16} mb={1.5} delay={0.2} />
        <SkeletonLine width="80%" height={16} mb={1.5} delay={0.4} />
        <SkeletonLine width="40%" height={16} delay={0.6} />
      </CardContent>
    </Card>
  );
}
