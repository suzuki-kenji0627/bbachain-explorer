import React, { FC, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  SvgIcon,
} from "@mui/material";

// Components
import { LoadingCard } from "./common/LoadingCard";

// Hooks
import { FetchStatus } from "hooks/useCache";
import { ClusterStatus, useCluster } from "hooks/useCluster";
import { useFetchValidators, useValidators } from "hooks/useValidators";

// Lightning Icon Component
const UsersIcon = () => (
  <SvgIcon sx={{ fontSize: "2rem" }}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
      fill="none"
      stroke="currentColor"
    />
  </SvgIcon>
);

export const ValidatorsStats: FC = () => {
  const { status } = useCluster();
  const validators = useValidators();
  const fetchValidators = useFetchValidators();

  // Fetch validators on load
  useEffect(() => {
    if (!validators && status === ClusterStatus.Connected) {
      fetchValidators();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!validators || validators.status === FetchStatus.Fetching) {
    return <LoadingCard message="Loading validators" />;
  }

  if (!validators.data || !validators.data.currentValidators) {
    return null;
  }

  const { currentValidators, delinquentValidators } = validators.data;
  const activeValidators = currentValidators.length;
  const delinquentCount = delinquentValidators
    ? delinquentValidators.length
    : 0;
  const totalValidators = activeValidators + delinquentCount;
  const activePercentage =
    totalValidators > 0
      ? ((activeValidators / totalValidators) * 100).toFixed(1)
      : "0";

  const stats = [
    {
      title: "TOTAL VALIDATORS",
      value: totalValidators.toLocaleString(),
      icon: <UsersIcon />,
    },
    {
      title: "ACTIVE VALIDATORS",
      value: activeValidators.toLocaleString(),
      subtitle: `${activePercentage}% of total`,
      icon: <UsersIcon />,
    },
    {
      title: "DELINQUENT VALIDATORS",
      value: delinquentCount.toLocaleString(),
      subtitle: delinquentCount > 0 ? "Need attention" : "All performing well",
      icon: <UsersIcon />,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ width: "100%", mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} md={4} key={index}>
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
                {stat.value}
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
