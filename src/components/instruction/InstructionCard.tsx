import React, { useContext } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Box,
  Chip,
} from "@mui/material";
import {
  TransactionInstruction,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { SignatureContext } from "views/tx";

// Components
import { Address } from "components/common/Address";
import { RawDetail } from "./RawDetail";
import { RawParsedDetail } from "./RawParsedDetail";

// Hooks
import {
  useFetchTransactionDetailRaw,
  useTransactionDetailRaw,
} from "hooks/useTransactionDetailRaw";

type InstructionProps = {
  title: string;
  children?: React.ReactNode;
  result: SignatureResult;
  index: number;
  ix: TransactionInstruction | ParsedInstruction;
  defaultRaw?: boolean;
  innerCards?: JSX.Element[];
  childIndex?: number;
};

export function InstructionCard({
  title,
  children,
  result,
  index,
  ix,
  defaultRaw,
  innerCards,
  childIndex,
}: InstructionProps) {
  const [resultClass] = ixResult(result, index);
  const [showRaw, setShowRaw] = React.useState(defaultRaw || false);
  const signature = useContext(SignatureContext);
  const rawDetail = useTransactionDetailRaw(signature);

  let raw: TransactionInstruction | undefined = undefined;
  if (rawDetail && childIndex === undefined) {
    raw = rawDetail?.data?.raw?.transaction.instructions[index];
  }

  const fetchRaw = useFetchTransactionDetailRaw();
  const fetchRawTrigger = () => fetchRaw(signature);

  const rawClickHandler = () => {
    if (!defaultRaw && !showRaw && !raw) {
      fetchRawTrigger();
    }

    return setShowRaw((r) => !r);
  };

  return (
    <Card
      sx={{
        mb: 4,
        background:
          "linear-gradient(135deg, rgba(20, 70, 15, 0.8) 0%, rgba(17, 25, 9, 0.9) 100%)",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              label={`#${index + 1}${
                childIndex !== undefined ? `.${childIndex + 1}` : ""
              }`}
              color={
                resultClass === "success"
                  ? "success"
                  : resultClass === "warning"
                  ? "warning"
                  : "error"
              }
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 600,
                color: "#ff9900",
                flex: 1,
              }}
            >
              ⚙️ {title}
            </Typography>
          </Box>

          <Button
            disabled={defaultRaw}
            variant={showRaw ? "outlined" : "contained"}
            color="primary"
            size="small"
            onClick={rawClickHandler}
          >
            💻 Raw
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          <TableContainer>
            <Table
              sx={{
                "& .MuiTableCell-root": {
                  border: "none",
                  py: 2,
                  "&:first-of-type": {
                    fontWeight: 600,
                    color: "text.secondary",
                    width: "200px",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  },
                  "&:last-of-type": {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  },
                },
              }}
            >
              <TableBody>
                {showRaw ? (
                  <>
                    <TableRow>
                      <TableCell>Program</TableCell>
                      <TableCell>
                        <Address pubkey={ix.programId} link />
                      </TableCell>
                    </TableRow>
                    {"parsed" in ix ? (
                      <RawParsedDetail ix={ix}>
                        {raw ? <RawDetail ix={raw} /> : null}
                      </RawParsedDetail>
                    ) : (
                      <RawDetail ix={ix} />
                    )}
                  </>
                ) : (
                  children
                )}
                {innerCards && innerCards.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{
                          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                          pt: 3,
                          fontWeight: 600,
                          color: "#ff9900",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Inner Instructions
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} sx={{ p: 0 }}>
                        <Box sx={{ p: 2 }}>{innerCards}</Box>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

function ixResult(result: SignatureResult, index: number) {
  if (result.err) {
    const err = result.err as any;
    const ixError = err["InstructionError"];
    if (ixError && Array.isArray(ixError)) {
      const [errorIndex, error] = ixError;
      if (Number.isInteger(errorIndex) && errorIndex === index) {
        return ["warning", `Error: ${JSON.stringify(error)}`];
      }
    }
    return ["dark"];
  }
  return ["success"];
}
