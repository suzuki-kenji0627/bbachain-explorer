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
      <TableRow
        key={key}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(100, 116, 139, 0.1)",
          },
        }}
      >
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={account} link />
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Address pubkey={new PublicKey(mint)} link />
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <BalanceDelta delta={delta} />
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "1px solid rgba(100, 116, 139, 0.1)",
            py: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {balance.uiAmountString} UNITs
          </Typography>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Card
      sx={{
        mb: 3,
        background:
          "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 214, 160, 0.1) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
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
              background: "linear-gradient(135deg, #10B981 0%, #06D6A0 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            💰 Token Balances
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                    py: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "0.875rem",
                  }}
                >
                  Address
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                    py: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "0.875rem",
                  }}
                >
                  Token
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                    py: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "0.875rem",
                  }}
                >
                  Change
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
                    py: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "0.875rem",
                  }}
                >
                  Post Balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{accountRows}</TableBody>
          </Table>
        </TableContainer>
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
