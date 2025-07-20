import React, { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";

// Components
import { LoadingCard } from "components/common/LoadingCard";
import { ErrorCard } from "components/common/ErrorCard";

// Hooks
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { SupplyStatus, useFetchSupply, useSupply } from "hooks/useSupply";
import {
  useStatsInfo,
  useStatsProvider,
  usePerformanceInfo,
} from "hooks/useStatsInfo";
import useQueryContext from "hooks/useQueryContext";

// Utils
import { toBBA, abbreviatedNumber } from "utils";
import { slotsToHumanString } from "utils";

// Icons (SVG components)
const SupplyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BlockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="7"
      y="7"
      width="10"
      height="10"
      rx="1"
      ry="1"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const TransactionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 16l4-4-4-4M15 8v8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const EpochIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <polyline
      points="12,6 12,12 16,14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NetworkStats: FC = () => {
  const { fmtUrlWithCluster } = useQueryContext();
  const { cluster, status } = useCluster();
  const supply: any = useSupply();
  const fetchSupply = useFetchSupply();
  const statsInfo = useStatsInfo();
  const { setActive } = useStatsProvider();
  const [mounted, setMounted] = useState(false);

  const performanceInfo = usePerformanceInfo();
  const transactionCount = performanceInfo.transactionCount;

  const { avgSlotTime_1min, avgSlotTime_1h, epochInfo } = statsInfo;
  const averageSlotTime = Math.round(1000 * avgSlotTime_1min);
  const hourlySlotTime = Math.round(1000 * avgSlotTime_1h);

  const { blockHeight, slotIndex, slotsInEpoch } = epochInfo;
  const epochProgress = ((100 * slotIndex) / slotsInEpoch).toFixed(1) + "%";
  const epochTimeRemaining = slotsToHumanString(
    slotsInEpoch - slotIndex,
    hourlySlotTime
  );

  function fetchData() {
    fetchSupply();
  }

  function displayDaltons(value: number) {
    return abbreviatedNumber(toBBA(value));
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === ClusterStatus.Connected) {
      fetchData();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActive(true);
    return () => setActive(false);
  }, [setActive, cluster]);

  // Show loading during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Card
                sx={{
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(100, 116, 139, 0.2)",
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 140,
                }}
              >
                <CircularProgress sx={{ color: "primary.main" }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (supply === SupplyStatus.Disconnected) {
    // we'll return here to prevent flicker
    return null;
  }

  if (supply === SupplyStatus.Idle || supply === SupplyStatus.Connecting) {
    return <LoadingCard message="Loading supply and price data" />;
  } else if (typeof supply === "string") {
    return <ErrorCard text={supply} retry={fetchData} />;
  }

  const stats = [
    {
      title: "TOTAL SUPPLY",
      value: displayDaltons(supply.circulating),
      subtitle: "BBA Tokens",
      icon: <SupplyIcon />,
      gradient:
        "linear-gradient(135deg, rgba(6, 214, 160, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)",
      iconColor: "#06D6A0",
    },
    {
      title: "LATEST BLOCK",
      value: blockHeight.toLocaleString(),
      subtitle: `${averageSlotTime}ms avg`,
      link: `/block/${blockHeight}`,
      icon: <BlockIcon />,
      gradient:
        "linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
      iconColor: "#3B82F6",
    },
    {
      title: "TRANSACTIONS",
      value: transactionCount.toLocaleString(),
      subtitle: "Total processed",
      icon: <TransactionIcon />,
      gradient:
        "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
      iconColor: "#8B5CF6",
    },
    {
      title: "CURRENT EPOCH",
      value: epochInfo.epoch.toLocaleString(),
      subtitle: `${epochProgress} complete`,
      icon: <EpochIcon />,
      gradient:
        "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)",
      iconColor: "#F59E0B",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Network Overview
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Real-time statistics and metrics from the BBAChain network
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => {
          const StatComponent = (
            <Card
              sx={{
                height: "100%",
                background: stat.gradient,
                border: "1px solid rgba(100, 116, 139, 0.2)",
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
                cursor: stat.link ? "pointer" : "default",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  borderColor: stat.iconColor,
                },
              }}
            >
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: stat.iconColor,
                      opacity: 0.8,
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    lineHeight: 1.2,
                    mb: stat.subtitle ? 1 : 0,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {stat.value}
                </Typography>

                {stat.subtitle && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      opacity: 0.8,
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                )}

                {/* Progress indicator for epoch */}
                {stat.title === "CURRENT EPOCH" && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        height: 4,
                        bgcolor: "rgba(100, 116, 139, 0.3)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: epochProgress,
                          background: `linear-gradient(90deg, ${stat.iconColor} 0%, ${stat.iconColor}88 100%)`,
                          borderRadius: 2,
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          );

          return (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              {stat.link ? (
                <Link
                  href={fmtUrlWithCluster(stat.link)}
                  style={{ textDecoration: "none" }}
                >
                  {StatComponent}
                </Link>
              ) : (
                StatComponent
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
