import React from "react";
import Image from "next/image";
import logoSvg from "../icons/logo.svg";

interface BBAIconProps {
  size?: number;
}

export function BBAIcon({ size = 16, ...props }: BBAIconProps) {
  return (
    <Image
      {...props}
      src={logoSvg}
      alt="BBA Coin"
      height={size}
      width={size}
    />
  );
}
