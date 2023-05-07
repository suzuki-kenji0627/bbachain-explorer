import React from "react";
import Link from "next/link";

type Props = {
  slot: number;
  link?: boolean;
};
export function Slot({ slot, link }: Props) {
  return (
    <span className="font-monospace">
      {link ? (<Link href={`/block/${slot}`}>{slot.toLocaleString("en-US")}</Link>) : (slot.toLocaleString("en-US"))}
    </span>
  );
}
