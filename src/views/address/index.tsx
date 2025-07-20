import React, { FC } from "react";
import { PublicKey } from "@bbachain/web3.js";
import { Box } from "@mui/material";

// Components
import { HeadContainer } from "components/HeadContainer";
import { AddressDetail } from "components/AddressDetail";
import { ErrorCard } from "components/common/ErrorCard";

// Hooks
import { useAddress, useFetchAddress } from "hooks/useAddress";
import { ClusterStatus, useCluster } from "hooks/useCluster";

type Props = { address: string };

export const AddressDetailView: FC<Props> = ({ address }) => {
  const info = useAddress(address);
  const fetchAccount = useFetchAddress();

  const { status } = useCluster();

  let pubkey: PublicKey | undefined;

  try {
    pubkey = new PublicKey(address);
  } catch (err) {}

  // Fetch account on load
  React.useEffect(() => {
    if (!info && status === ClusterStatus.Connected && pubkey) {
      fetchAccount(pubkey, "parsed");
    }
  }, [address, status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 25%,
            rgba(51, 65, 85, 0.8) 50%,
            rgba(30, 58, 138, 0.7) 75%,
            rgba(79, 70, 229, 0.6) 100%
          ),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)
        `,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%),
            linear-gradient(-45deg, transparent 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)
          `,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: 4,
          py: 3,
        }}
      >
        <HeadContainer />

        <Box sx={{ width: "100%", mb: 4 }}>
          {!pubkey ? (
            <ErrorCard text={`Address "${address}" is not valid`} />
          ) : (
            <AddressDetail pubkey={pubkey} info={info} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
