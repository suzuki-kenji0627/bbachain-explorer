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

async function getLastTransactions(connection: Connection): Promise<{
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
    if (latestDocument.slot > slot - 10) return { transactions: [] };
    const blocks = await connection.getBlocks(
      Math.max(latestDocument.slot, slot - 5),
      slot
    );
    let blockSignatures: Array<string> = [];
    await Promise.all(
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
  console.log(transactions);
  return { transactions };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const no_of_docs_each_page = 25; // 2 docs in single page

  const { page, docs } = req.query;
  const connection = new Connection(TESTNET_URL, "confirmed");
  const client = await clientPromise;
  const db = client.db("bbscan");
  const collection = db.collection("transactions");
  if (req.method === "GET") {
    const transactionResponse = await collection
      .find({})
      .sort({ slot: -1 })
      .skip((Number(docs) || no_of_docs_each_page) * Number(page || 0))
      .limit(Number(docs) || no_of_docs_each_page)
      .toArray();
    try {
      res.status(200).json({ transactionResponse });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).end();
    }
  } else if (req.method === "POST") {
    console.log("updating");
    try {
      const { transactions } = await getLastTransactions(connection);
      await collection.insertMany(transactions);
    } catch (e) {
      console.log(e);
    }
    res.status(200).json({ message: "updated" });
  }
}
