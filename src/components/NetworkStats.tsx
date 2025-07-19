import React, { FC, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  SvgIcon,
} from "@mui/material";
import Link from "next/link";

// Components
import { Epoch } from "./common/Epoch";
import { ErrorCard } from "./common/ErrorCard";
import { LoadingCard } from "./common/LoadingCard";

// Hooks
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { SupplyStatus, useFetchSupply, useSupply } from "hooks/useSupply";
import {
  usePerformanceInfo,
  useStatsInfo,
  useStatsProvider,
} from "hooks/useStatsInfo";
import useQueryContext from "hooks/useQueryContext";

// Utils
import { abbreviatedNumber, slotsToHumanString, toBBA } from "utils";

// Lightning Icon Component
const LightningIcon = () => (
  <SvgIcon sx={{ fontSize: "2rem" }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 10V3L4 14h7v7l9-11h-7z"
      fill="none"
      stroke="currentColor"
    />
  </SvgIcon>
);

export const NetworkStats: FC = () => {
  const { fmtUrlWithCluster } = useQueryContext();
  const { cluster, status } = useCluster();
  const supply: any = useSupply();
  const fetchSupply = useFetchSupply();
  const statsInfo = useStatsInfo();
  const { setActive } = useStatsProvider();

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
    if (status === ClusterStatus.Connected) {
      fetchData();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActive(true);
    return () => setActive(false);
  }, [setActive, cluster]);

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
      title: "SUPPLY",
      value: displayDaltons(supply.circulating),
      icon: <LightningIcon />,
    },
    {
      title: `BLOCKS (${averageSlotTime}ms)`,
      value: blockHeight,
      link: `/block/${blockHeight}`,
      icon: <LightningIcon />,
    },
    {
      title: "TRANSACTIONS",
      value: transactionCount,
      icon: <LightningIcon />,
    },
    {
      title: "CURRENT EPOCH",
      value: epochInfo.epoch,
      subtitle: `${epochProgress} complete`,
      icon: <LightningIcon />,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ width: "100%", mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: "100%",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
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
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Box sx={{ color: "text.secondary", opacity: 0.7 }}>
                  {stat.icon}
                </Box>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  lineHeight: 1.2,
                  mb: stat.subtitle ? 1 : 0,
                }}
              >
                {stat.link ? (
                  <Link
                    href={fmtUrlWithCluster(stat.link)}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {stat.value}
                  </Link>
                ) : (
                  stat.value
                )}
              </Typography>

              {stat.subtitle && (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1 }}
                >
                  {stat.subtitle}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
