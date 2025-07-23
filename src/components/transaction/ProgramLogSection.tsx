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
        mb: 3,
        background:
          "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)",
        border: "1px solid rgba(245, 158, 11, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              flex: 1,
            }}
          >
            📝 Program Instruction Logs
          </Typography>
          <Button
            variant={showRaw ? "outlined" : "contained"}
            color="primary"
            size="small"
            onClick={() => setShowRaw((r) => !r)}
            sx={{
              minWidth: "auto",
              px: 2,
              fontSize: "0.875rem",
            }}
          >
            💻 Raw
          </Button>
        </Box>

        <Box>
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
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
                textAlign: "center",
                py: 2,
              }}
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
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 2,
        p: 2,
        fontFamily: "monospace",
        fontSize: "0.875rem",
        maxHeight: 400,
        overflow: "auto",
      }}
    >
      {raw.map((log, key) => {
        return (
          <Box
            key={key}
            sx={{
              py: 0.5,
              borderBottom:
                key < raw.length - 1
                  ? "1px solid rgba(100, 116, 139, 0.1)"
                  : "none",
              color: "text.secondary",
            }}
          >
            {log}
          </Box>
        );
      })}
    </Box>
  );
}
