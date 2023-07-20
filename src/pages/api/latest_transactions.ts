// pages/api/transactions.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { MAINNET_URL, TESTNET_URL } from "hooks/useCluster";
import {
  Connection,
  ParsedTransactionWithMeta,
  BlockResponse,
  SignatureStatus,
} from "@bbachain/web3.js";
import clientPromise from "../../lib/mongodb";
let updating = false;
type Confirmations = {
  confirmations?: SignatureStatus;
};

type ParsedTransactionWithMetaExtended = ParsedTransactionWithMeta &
  Confirmations;

async function getLastTransactions(
  connection: Connection,
  limit: number
): Promise<{
  transactions: ParsedTransactionWithMetaExtended[];
}> {
  const transactions: ParsedTransactionWithMetaExtended[] = [];
  while (true) {
    try {
      const slot = await connection.getBlockHeight();
      const block = await connection.getBlockSignatures(slot);
      for (let i = 0; i < block.signatures.length; i++) {
        const transaction = await connection.getParsedTransaction(
          block.signatures[i]
        );
        const { value } = await connection.getSignatureStatus(
          block.signatures[i]
        );
        transactions.push({
          ...transaction,
          ...{ confirmations: value, signature: block.signatures[i] },
        });

        if (transactions.length === limit) {
          break;
        }
      }
      if (transactions.length === limit) {
        break;
      }
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  }

  return { transactions };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const no_of_docs_each_page = 25; // 2 docs in single page

  const { page, docs } = req.query;
  const limit = 700;
  const connection = new Connection(MAINNET_URL, "confirmed");

  try {
    const client = await clientPromise;
    const db = client.db("bbscan");
    const collection = db.collection("transactions");
    const transactionResponse = await collection
      .find({})
      .skip((Number(docs) || no_of_docs_each_page) * Number(page || 0))
      .limit(Number(docs) || no_of_docs_each_page)
      .toArray();
    console.log(updating);
    if (!updating) {
      updating = true;
      getLastTransactions(connection, limit)
        .then(async ({ transactions }) => {
          updating = true;
          await collection.drop();
          await collection.insertMany(transactions);
          updating = false;
        })
        .catch((e) => {
          updating = false;
        });
    }

    res.status(200).json({ transactionResponse });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
}
