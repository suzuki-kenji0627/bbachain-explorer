// pages/api/transactions.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createRobustConnection } from "hooks/useCluster";
import {
  Connection,
  ParsedTransactionWithMeta,
  SignatureStatus,
} from "@bbachain/web3.js";
import clientPromise from "../../lib/mongodb";

let updating = false;

type Confirmations = {
  confirmations?: SignatureStatus;
};

type ParsedTransactionWithMetaExtended = ParsedTransactionWithMeta &
  Confirmations;

// Add retry utility function
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
  throw new Error("Max retries exceeded");
}

// Using createRobustConnection from useCluster

async function getLastTransactions(
  connection: Connection,
  name: string
): Promise<{
  transactions: ParsedTransactionWithMetaExtended[];
}> {
  let transactions: ParsedTransactionWithMetaExtended[] = [];

  try {
    const client = await clientPromise;
    const db = client.db(name);
    const collection = db.collection("transactions");
    const latestDocument = (await collection.findOne(
      {},
      { sort: { _id: -1 } }
    )) || { slot: 0 };

    try {
      await collection.deleteMany({
        slot: { $lt: latestDocument.slot - 300 },
      });
    } catch (e) {
      console.log("MongoDB cleanup error:", e);
    }

    const slot = await retryOperation(() => connection.getBlockHeight());
    if (latestDocument.slot > slot - 10) return { transactions: [] };

    console.log(
      `Fetching blocks from ${Math.max(
        latestDocument.slot,
        slot - 5
      )} to ${slot}`
    );

    const blocks = await retryOperation(() =>
      connection.getBlocks(Math.max(latestDocument.slot, slot - 5), slot)
    );

    let blockSignatures: Array<string> = [];

    // Process blocks in smaller batches to avoid overwhelming the API
    const batchSize = 2;
    for (let i = 0; i < blocks.length; i += batchSize) {
      const blockBatch = blocks.slice(i, i + batchSize);
      const batchSignatures = await Promise.all(
        blockBatch.map(async (block) => {
          try {
            const bs = await retryOperation(() =>
              connection.getBlockSignatures(block)
            );
            return bs.signatures;
          } catch (error) {
            console.warn(
              `Failed to get signatures for block ${block}:`,
              error.message
            );
            return [];
          }
        })
      );
      blockSignatures = [...blockSignatures, ...batchSignatures.flat()];
    }

    console.log(`Found ${blockSignatures.length} signatures to process`);

    // Process transactions in smaller batches
    const txBatchSize = 5;
    const allTransactions: ParsedTransactionWithMetaExtended[] = [];

    for (let i = 0; i < blockSignatures.length; i += txBatchSize) {
      const signatureBatch = blockSignatures.slice(i, i + txBatchSize);
      const batchTransactions = await Promise.all(
        signatureBatch.map(async (signature) => {
          try {
            const [transaction, statusResponse] = await Promise.all([
              retryOperation(() => connection.getParsedTransaction(signature)),
              retryOperation(() =>
                connection.getSignatureStatus(signature, {
                  searchTransactionHistory: true,
                })
              ),
            ]);

            if (!transaction) {
              console.warn(`Transaction ${signature} not found`);
              return null;
            }

            return {
              ...transaction,
              confirmations: statusResponse.value,
              signature: signature,
              signer:
                transaction.transaction.message.accountKeys
                  .filter((acc) => acc.signer)[0]
                  ?.pubkey.toString() || "Unknown",
            };
          } catch (error) {
            console.warn(
              `Failed to process transaction ${signature}:`,
              error.message
            );
            return null;
          }
        })
      );

      allTransactions.push(...batchTransactions.filter((tx) => tx !== null));
    }

    transactions = allTransactions;
    console.log(`Successfully processed ${transactions.length} transactions`);
  } catch (error) {
    console.error("Error fetching block data:", error);
    // Return empty array instead of crashing
    return { transactions: [] };
  }

  return { transactions };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const no_of_docs_each_page = 25; // 2 docs in single page

  const { page, docs, name, url } = req.query;
  // console.log(name, url);
  const connection = createRobustConnection(<string>url);
  const client = await clientPromise;
  const db = client.db(name);
  const collection = db.collection("transactions");
  if (req.method === "GET") {
    try {
      const transactionResponse = await collection
        .find({})
        .sort({ slot: -1 })
        .skip((Number(docs) || no_of_docs_each_page) * Number(page || 0))
        .limit(Number(docs) || no_of_docs_each_page)
        .toArray();
      res.status(200).json({ transactionResponse });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).end();
    }
  } else if (req.method === "POST") {
    try {
      const { transactions } = await getLastTransactions(
        connection,
        <string>name
      );

      // Only insert if there are transactions to avoid empty batch error
      if (transactions && transactions.length > 0) {
        await collection.insertMany(transactions);
      }
    } catch (e) {
      console.log(e);
    }
    res.status(200).json({ message: "updated" });
  }
}
