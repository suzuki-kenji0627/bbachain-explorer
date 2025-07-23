import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import logoSvg from "../icons/logo.svg";
import useQueryContext from "hooks/useQueryContext";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 200, height = 100, className = "" }: LogoProps) {
  const { fmtUrlWithCluster } = useQueryContext();
  // Calculate proportional sizing for the logo
  const logoSize = height * 0.5; // Main logo takes 50% of height

  return (
    <Link href={fmtUrlWithCluster("/")} style={{ textDecoration: "none" }}>
      <Box
        className={className}
        sx={{
          display: "flex",
          alignItems: "center",
          width,
          height,
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        {/* BBA Chain Logo from logo.svg */}
        <Image
          src={logoSvg}
          alt="BBAChain Logo"
          style={{
            width: logoSize,
            height: logoSize,
            objectFit: "contain",
          }}
        />

        {/* EXPLORER text with gradient styling */}
        <Typography
          variant="h6"
          sx={{
            ml: 2,
            fontWeight: 700,
            color: "white",
            textDecoration: "none",
            background: "linear-gradient(135deg, #06D6A0 0%, #1A9D59 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1.1rem", md: "1.25rem" },
          }}
        >
          EXPLORER
        </Typography>
      </Box>
    </Link>
  );
}

export default Logo;
