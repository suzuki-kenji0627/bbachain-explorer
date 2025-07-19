import React from "react";
import Image from "next/image";
import logoSvg from "../icons/logo.svg";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 200, height = 100, className = "" }: LogoProps) {
  // Calculate proportional sizing for the logo
  const logoSize = height * 0.5; // Main logo takes 60% of height
  const textSize = height * 0.3; // Text size relative to height

  return (
    <div className={`flex items-center ${className}`} style={{ width, height }}>
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

      {/* BBAChain text with modern styling */}
      <div className="ml-3 flex flex-col">
        {/* Explorer text */}
        <span
          style={{
            fontSize: textSize * 0.75,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: "500",
            color: "#6b7280",
            letterSpacing: "0.025em",
            lineHeight: "1",
          }}
        >
          EXPLORER
        </span>
      </div>
    </div>
  );
}

export default Logo;
