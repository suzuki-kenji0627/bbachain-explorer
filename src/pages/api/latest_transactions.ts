// pages/api/transactions.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { MAINNET_URL, TESTNET_URL } from "hooks/useCluster";
import {
  Connection,
  ParsedTransactionWithMeta,
  BlockResponse,
  SignatureStatus,
  BlockSignatures,
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
  let transactions: ParsedTransactionWithMetaExtended[] = [];
  const client = await clientPromise;
  const db = client.db("bbscan");
  const collection = db.collection("transactions");
  const latestDocument = await collection.findOne({}, { sort: { _id: -1 } });
  await collection.deleteMany({
    slot: { $lt: latestDocument.slot - 300 },
  });
  try {
    const slot = await connection.getBlockHeight();
    const blocks = await connection.getBlocks(
      Math.min(latestDocument.slot, slot - 5),
      slot
    );
    let blockSignatures: Array<string> = [];
    await Promise.allSettled(
      blocks.map(async (block) => {
        const bs = await connection.getBlockSignatures(block);
        blockSignatures = [...blockSignatures, ...bs.signatures];
      })
    );
    transactions = await Promise.all(
      blockSignatures.map(async (signature) => {
        const transaction = await connection.getParsedTransaction(signature);
        const { value } = await connection.getSignatureStatus(signature);
        return {
          ...transaction,
          ...{
            confirmations: value,
            signature: signature,
            signer: transaction.transaction.message.accountKeys
              .filter((acc) => acc.signer)[0]
              .pubkey.toString(),
          },
        };
      })
    );
  } catch (error) {
    console.error("Error fetching block data:", error);
  }
  //}

  return { transactions };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const no_of_docs_each_page = 25; // 2 docs in single page

  const { page, docs } = req.query;
  const limit = 100;
  const connection = new Connection(TESTNET_URL, "confirmed");
  const client = await clientPromise;
  const db = client.db("bbscan");
  const collection = db.collection("transactions");
  const transactionResponse = await collection
    .find({})
    .sort({ slot: -1 })
    .skip((Number(docs) || no_of_docs_each_page) * Number(page || 0))
    .limit(Number(docs) || no_of_docs_each_page)
    .toArray();
  try {
    const transactions = await getLastTransactions(connection, limit);
    await collection.insertMany(transactions);
    res.status(200).json({ transactionResponse });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(200).json({ transactionResponse });
  }
}
