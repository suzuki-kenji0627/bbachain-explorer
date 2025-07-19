import React from "react";
import { Chip, Typography, Link as MuiLink } from "@mui/material";
import { VerifiableBuild } from "utils/program-verification";

export function VerifiedBadge({
  verifiableBuild,
  deploySlot,
}: {
  verifiableBuild: VerifiableBuild;
  deploySlot: number;
}) {
  if (verifiableBuild && verifiableBuild.verified_slot === deploySlot) {
    return (
      <Typography variant="h6" sx={{ mb: 0 }}>
        <MuiLink
          href={verifiableBuild.label}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <Chip
            label={`${verifiableBuild.label}: Verified`}
            color="info"
            size="small"
            sx={{
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "info.dark",
              },
            }}
          />
        </MuiLink>
      </Typography>
    );
  } else {
    return (
      <Typography variant="h6" sx={{ mb: 0 }}>
        <Chip
          label={`${verifiableBuild.label}: Unverified`}
          color="warning"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Typography>
    );
  }
}

export function CheckingBadge() {
  return (
    <Typography variant="h6" sx={{ mb: 0 }}>
      <Chip
        label="Checking"
        color="default"
        size="small"
        sx={{
          fontWeight: 600,
          backgroundColor: "grey.800",
          color: "common.white",
        }}
      />
    </Typography>
  );
}
