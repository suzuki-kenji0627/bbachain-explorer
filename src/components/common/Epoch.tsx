import React from "react";
import Link from "next/link";
import useQueryContext from "hooks/useQueryContext";

type Props = {
  epoch: number | bigint;
  link?: boolean;
};
export function Epoch({ epoch, link }: Props) {
  const {fmtUrlWithCluster} = useQueryContext();

  return (
    <span className="font-monospace">
      {link ? (
        <Link href={fmtUrlWithCluster(`/epoch/${epoch}`)}>
        {epoch.toLocaleString("en-US")}
        </Link>
      ) : (
        epoch.toLocaleString("en-US")
      )}
    </span>
  );
}
