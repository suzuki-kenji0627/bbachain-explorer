import React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

interface BBAIconProps extends SvgIconProps {
  size?: number;
}

export function BBAIcon({ size = 16, sx, ...props }: BBAIconProps) {
  return (
    <SvgIcon
      {...props}
      sx={{
        width: size,
        height: size,
        "@keyframes spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "@keyframes pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        ...sx,
      }}
      viewBox="0 0 24 24"
    >
      {/* Simplified BBA logo - circular design with "B" */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#bba-gradient)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        B
      </text>
      <defs>
        <linearGradient id="bba-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06D6A0" />
          <stop offset="50%" stopColor="#1CFF00" />
          <stop offset="100%" stopColor="#00E920" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
}
