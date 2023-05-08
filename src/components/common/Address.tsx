import React from "react";
import Link from "next/link";
import { PublicKey } from "@bbachain/web3.js";
import useQueryContext from "hooks/useQueryContext";

type Props = {
  pubkey: PublicKey;
  link?: boolean;
};
export function Address({ pubkey, link }: Props) {
  const {fmtUrlWithCluster} = useQueryContext();
  const address = pubkey.toBase58();

  return (
    <span className="font-monospace">
      {link ? (<Link href={fmtUrlWithCluster(`/address/${address}`)}>{address}</Link>) : (address)}
    </span>
  );
}
