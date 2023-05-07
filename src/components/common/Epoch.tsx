import React from "react";
import Link from "next/link";

type Props = {
  epoch: number | bigint;
  link?: boolean;
};
export function Epoch({ epoch, link }: Props) {
  return (
    <span className="font-monospace">
      {link ? (
        <Link href={`/epoch/${epoch}`}>
        {epoch.toLocaleString("en-US")}
        </Link>
      ) : (
        epoch.toLocaleString("en-US")
      )}
    </span>
  );
}
