import React from "react";
import Link from "next/link";
import useQueryContext from "hooks/useQueryContext";

type Props = {
  slot: number;
  link?: boolean;
};
export function Slot({ slot, link }: Props) {
  const {fmtUrlWithCluster} = useQueryContext();

  return (
    <span className="font-monospace">
      {link ? (<Link href={fmtUrlWithCluster(`/block/${slot}`)}>{slot.toLocaleString("en-US")}</Link>) : (slot.toLocaleString("en-US"))}
    </span>
  );
}
