import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  VersionedBlockResponse,
  ParsedTransaction,
  PartiallyDecodedInstruction,
} from "@bbachain/web3.js";
import { Signature } from "components/common/Signature";
import { Balance } from "components/common/Balance";
import { intoTransactionInstruction } from "utils/tx";

const MAX_TRANSACTIONS_DISPLAYED = 10;

export function BlockHistoryCard({ block }: { block: VersionedBlockResponse }) {
  const [numDisplayed, setNumDisplayed] = React.useState(
    MAX_TRANSACTIONS_DISPLAYED
  );

  const showMore = () => setNumDisplayed((current) => current + 10);

  if (block.transactions.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This block has no transactions.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const transactions = block.transactions;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Transactions
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Signature</TableCell>
                <TableCell align="right">Fee</TableCell>
                <TableCell>Invoked Programs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(0, numDisplayed).map((tx, i) => {
                let statusText: string;
                let statusClass: string;
                let signature: React.ReactNode = "N/A";

                if (tx.meta?.err) {
                  statusClass = "warning";
                  statusText = "Failed";
                } else {
                  statusClass = "success";
                  statusText = "Success";
                }

                // Extract signature from transaction.signatures array
                if (
                  tx.transaction.signatures &&
                  tx.transaction.signatures.length > 0
                ) {
                  signature = (
                    <Signature
                      signature={tx.transaction.signatures[0]}
                      link
                      truncateChars={48}
                    />
                  );
                }

                return (
                  <TableRow key={tx.transaction.signatures[0] || i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusText}
                        color={
                          statusClass === "success" ? "success" : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{signature}</TableCell>
                    <TableCell align="right">
                      {tx.meta ? <Balance daltons={tx.meta.fee} /> : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {tx.transaction.message.compiledInstructions.length}{" "}
                        instruction(s)
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {numDisplayed < transactions.length && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Typography
              variant="button"
              onClick={showMore}
              sx={{
                cursor: "pointer",
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Show More
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
