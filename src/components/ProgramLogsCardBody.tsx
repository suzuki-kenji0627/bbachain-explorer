import React from "react";
import { ParsedMessage, PublicKey, VersionedMessage } from "@bbachain/web3.js";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Box,
  Typography,
} from "@mui/material";

// Hooks
import { Cluster } from "hooks/useCluster";

// Utils
import { InstructionLogs } from "utils/program-logs";

const NATIVE_PROGRAMS_MISSING_INVOKE_LOG: string[] = [
  "AddressLookupTab1e1111111111111111111111111",
  "ZkTokenProof1111111111111111111111111111111",
  "BPFLoader1111111111111111111111111111111111",
  "BPFLoader2111111111111111111111111111111111",
  "BPFLoaderUpgradeab1e11111111111111111111111",
];

export function ProgramLogsCardBody({
  message,
  logs,
  cluster,
  url,
}: {
  message: VersionedMessage | ParsedMessage;
  logs: InstructionLogs[];
  cluster: Cluster;
  url: string;
}) {
  let logIndex = 0;
  let instructionProgramIds: PublicKey[];
  if ("compiledInstructions" in message) {
    instructionProgramIds = message.compiledInstructions.map((ix) => {
      return message.staticAccountKeys[ix.programIdIndex];
    });
  } else {
    instructionProgramIds = message.instructions.map((ix) => ix.programId);
  }

  return (
    <Table sx={{ width: "100%" }}>
      <TableBody>
        {instructionProgramIds.map((programId, index) => {
          const programAddress = programId.toBase58();
          let programLogs: InstructionLogs | undefined = logs[logIndex];
          if (programLogs?.invokedProgram === programAddress) {
            logIndex++;
          } else if (
            programLogs?.invokedProgram === null &&
            programLogs.logs.length > 0 &&
            NATIVE_PROGRAMS_MISSING_INVOKE_LOG.includes(programAddress)
          ) {
            logIndex++;
          } else {
            programLogs = undefined;
          }

          let badgeColor: "default" | "warning" | "success" = "default";
          if (programLogs) {
            badgeColor = programLogs.failed ? "warning" : "success";
          }

          return (
            <TableRow key={index}>
              <TableCell sx={{ border: "none", p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: programLogs ? 2 : 0,
                  }}
                >
                  <Chip
                    label={`#${index + 1}`}
                    color={badgeColor}
                    size="small"
                    sx={{ mr: 2, fontWeight: 600 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      color: "text.primary",
                      fontWeight: 500,
                    }}
                  >
                    {programId.toString()} Instruction
                  </Typography>
                  <Typography sx={{ ml: 2, color: "text.secondary" }}>
                    ⌄
                  </Typography>
                </Box>

                {programLogs && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      p: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 1,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {programLogs.logs.map((log, key) => {
                      const textColor =
                        log.style === "info"
                          ? "info.main"
                          : log.style === "muted"
                          ? "text.secondary"
                          : "text.primary";

                      return (
                        <Typography
                          key={key}
                          component="span"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.875rem",
                            display: "block",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{ color: "text.secondary" }}
                          >
                            {log.prefix}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ color: textColor }}
                          >
                            {log.text}
                          </Typography>
                        </Typography>
                      );
                    })}
                  </Box>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
