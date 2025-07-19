import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { VersionedMessage, ParsedMessage } from "@bbachain/web3.js";

// Components
import { SignatureProps } from "views/tx";
import { ProgramLogsCardBody } from "components/ProgramLogsCardBody";

// Hooks
import { useCluster } from "hooks/useCluster";
import { useTransactionDetail } from "hooks/useTransactionDetail";

// Utils
import { parseProgramLogs } from "utils/program-logs";

export function ProgramLogSection({ signature }: SignatureProps) {
  const [showRaw, setShowRaw] = React.useState(false);
  const { cluster, url } = useCluster();
  const details = useTransactionDetail(signature);

  const transactionWithMeta = details?.data?.transactionWithMeta;
  if (!transactionWithMeta) return null;
  const message = transactionWithMeta.transaction.message;

  const logMessages = transactionWithMeta.meta?.logMessages || null;
  const err = transactionWithMeta.meta?.err || null;

  let prettyLogs = null;
  if (logMessages !== null) {
    prettyLogs = parseProgramLogs(logMessages, err, cluster);
  }

  return (
    <Card
      sx={{
        mb: 4,
        background:
          "linear-gradient(135deg, rgba(17, 25, 9, 0.9) 0%, rgba(20, 70, 15, 0.8) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            background: "rgba(0, 0, 0, 0.2)",
            p: 3,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "#33a382",
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            📝 Program Instruction Logs
          </Typography>
          <Button
            variant={showRaw ? "outlined" : "contained"}
            color="primary"
            size="small"
            onClick={() => setShowRaw((r) => !r)}
          >
            💻 Raw
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {prettyLogs !== null ? (
            showRaw ? (
              <RawProgramLogs raw={logMessages!} />
            ) : (
              <ProgramLogsCardBody
                message={message}
                logs={prettyLogs}
                cluster={cluster}
                url={url}
              />
            )
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              Logs not supported for this transaction
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function RawProgramLogs({ raw }: { raw: string[] }) {
  return (
    <>
      {raw.map((log, key) => {
        return <div key={key}>{log}</div>;
      })}
    </>
  );
}
