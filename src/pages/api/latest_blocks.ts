// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BlockResponse } from "@bbachain/web3.js";
import { TESTNET_URL, createRobustConnection } from "hooks/useCluster";

type Blocks = {
  blocks: BlockResponse[];
  next: number;
};

type Query = {
  block: number;
};

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Blocks>
) {
  try {
    const query = <Query>(<unknown>req.query);
    const connection = createRobustConnection(TESTNET_URL);

    const lastBlock = await retryOperation(() => connection.getBlockHeight());
    const end = Number(query.block) || lastBlock;

    console.log(`Fetching blocks from ${end - 25} to ${end}`);

    const blocks = await retryOperation(() =>
      connection.getBlocks(end - 25, end)
    );

    // Process blocks in smaller batches to avoid overwhelming the API
    const batchSize = 5;
    const allBlocks: BlockResponse[] = [];

    for (let i = 0; i < blocks.length; i += batchSize) {
      const blockBatch = blocks.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        blockBatch.map(async (block) => {
          try {
            return await retryOperation(() => connection.getBlock(block));
          } catch (error) {
            console.warn(`Failed to fetch block ${block}:`, error.message);
            return null;
          }
        })
      );
      allBlocks.push(...batchResults.filter((block) => block !== null));
    }

    console.log(`Successfully fetched ${allBlocks.length} blocks`);

    res.status(200).json({
      blocks: allBlocks,
      next: end - 25,
    });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({
      blocks: [],
      next: 0,
    });
  }
}
