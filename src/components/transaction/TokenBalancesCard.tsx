import React from "react";
import {
  ParsedMessageAccount,
  PublicKey,
  TokenAmount,
  TokenBalance,
} from "@bbachain/web3.js";
import { BigNumber } from "bignumber.js";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";

// Components
import { Address } from "components/common/Address";
import { BalanceDelta } from "components/common/BalanceDelta";
import { SignatureProps } from "views/tx";

// Hooks
import { useTransactionDetail } from "hooks/useTransactionDetail";

export type TokenBalanceRow = {
  account: PublicKey;
  mint: string;
  balance: TokenAmount;
  delta: BigNumber;
  accountIndex: number;
};

export function TokenBalancesCard({ signature }: SignatureProps) {
  const details = useTransactionDetail(signature);

  if (!details) {
    return null;
  }

  const transactionWithMeta = details.data?.transactionWithMeta;
  const preTokenBalances = transactionWithMeta?.meta?.preTokenBalances;
  const postTokenBalances = transactionWithMeta?.meta?.postTokenBalances;
  const accountKeys = transactionWithMeta?.transaction.message.accountKeys;

  if (!preTokenBalances || !postTokenBalances || !accountKeys) {
    return null;
  }

  const rows = generateTokenBalanceRows(
    preTokenBalances,
    postTokenBalances,
    accountKeys
  );

  if (rows.length < 1) {
    return null;
  }

  const accountRows = rows.map(({ account, delta, balance, mint }) => {
    const key = account.toBase58() + mint;

    return (
      <TableRow key={key}>
        <TableCell>
          <Address pubkey={account} link />
        </TableCell>
        <TableCell>
          <Address pubkey={new PublicKey(mint)} link />
        </TableCell>
        <TableCell>
          <BalanceDelta delta={delta} />
        </TableCell>
        <TableCell>{balance.uiAmountString} UNITs</TableCell>
      </TableRow>
    );
  });

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
            }}
          >
            💰 Token Balances
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <TableContainer>
            <Table
              sx={{
                "& .MuiTableCell-root": {
                  border: "none",
                  py: 2,
                  fontSize: "0.875rem",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Address
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Token
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Change (BBA)
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Post Balance (BBA)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{accountRows}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export function generateTokenBalanceRows(
  preTokenBalances: TokenBalance[],
  postTokenBalances: TokenBalance[],
  accounts: ParsedMessageAccount[]
): TokenBalanceRow[] {
  let preBalanceMap: { [index: number]: TokenBalance } = {};
  let postBalanceMap: { [index: number]: TokenBalance } = {};

  preTokenBalances.forEach(
    (balance) => (preBalanceMap[balance.accountIndex] = balance)
  );
  postTokenBalances.forEach(
    (balance) => (postBalanceMap[balance.accountIndex] = balance)
  );

  // Check if any pre token balances do not have corresponding
  // post token balances. If not, insert a post balance of zero
  // so that the delta is displayed properly
  for (let index in preBalanceMap) {
    const preBalance = preBalanceMap[index];
    if (!postBalanceMap[index]) {
      postBalanceMap[index] = {
        accountIndex: Number(index),
        mint: preBalance.mint,
        uiTokenAmount: {
          amount: "0",
          decimals: preBalance.uiTokenAmount.decimals,
          uiAmount: null,
          uiAmountString: "0",
        },
      };
    }
  }

  let rows: TokenBalanceRow[] = [];

  for (let index in postBalanceMap) {
    const { uiTokenAmount, accountIndex, mint } = postBalanceMap[index];
    const preBalance = preBalanceMap[accountIndex];
    const account = accounts[accountIndex].pubkey;

    if (!uiTokenAmount.uiAmountString) {
      // uiAmount deprecation
      continue;
    }

    // case where mint changes
    if (preBalance && preBalance.mint !== mint) {
      if (!preBalance.uiTokenAmount.uiAmountString) {
        // uiAmount deprecation
        continue;
      }

      rows.push({
        account: accounts[accountIndex].pubkey,
        accountIndex,
        balance: {
          decimals: preBalance.uiTokenAmount.decimals,
          amount: "0",
          uiAmount: 0,
        },
        delta: new BigNumber(-preBalance.uiTokenAmount.uiAmountString),
        mint: preBalance.mint,
      });

      rows.push({
        account: accounts[accountIndex].pubkey,
        accountIndex,
        balance: uiTokenAmount,
        delta: new BigNumber(uiTokenAmount.uiAmountString),
        mint: mint,
      });
      continue;
    }

    let delta;

    if (preBalance) {
      if (!preBalance.uiTokenAmount.uiAmountString) {
        // uiAmount deprecation
        continue;
      }

      delta = new BigNumber(uiTokenAmount.uiAmountString).minus(
        preBalance.uiTokenAmount.uiAmountString
      );
    } else {
      delta = new BigNumber(uiTokenAmount.uiAmountString);
    }

    rows.push({
      account,
      mint,
      balance: uiTokenAmount,
      delta,
      accountIndex,
    });
  }

  return rows.sort((a, b) => a.accountIndex - b.accountIndex);
}
