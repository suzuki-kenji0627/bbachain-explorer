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
        mb: 2,
        background:
          "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
        border: "1px solid rgba(79, 70, 229, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
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
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              flex: 1,
            }}
          >
            {title}
          </Typography>
          <Button
            disabled={defaultRaw}
            variant={showRaw ? "outlined" : "contained"}
            color="primary"
            size="small"
            onClick={rawClickHandler}
            sx={{
              minWidth: "auto",
              px: 2,
              fontSize: "0.875rem",
            }}
          >
            💻 Raw
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableBody>
              {showRaw ? (
                <>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                        py: 2,
                        fontWeight: 600,
                        color: "text.secondary",
                        width: "200px",
                      }}
                    >
                      Program
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                        py: 2,
                      }}
                    >
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
                        borderTop: "1px solid rgba(100, 116, 139, 0.2)",
                        borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
                        py: 2,
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontSize: "0.875rem",
                      }}
                    >
                      Inner Instructions
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      sx={{
                        p: 0,
                        borderBottom: "none",
                      }}
                    >
                      <Box sx={{ p: 2, pt: 0 }}>{innerCards}</Box>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

function ixResult(result: SignatureResult, index: number) {
  if (result.err) {
    const errorIndex = ixErrorIndex(result.err);
    if (errorIndex !== undefined && errorIndex === index) {
      return ["warning", "Instruction Error"];
    } else {
      return ["muted"];
    }
  }

  return ["success"];
}

function ixErrorIndex(err: any): number | undefined {
  if (typeof err === "object" && "InstructionError" in err) {
    if (
      typeof err["InstructionError"] === "object" &&
      Array.isArray(err["InstructionError"])
    ) {
      return err["InstructionError"][0];
    }
  }
  return undefined;
}
