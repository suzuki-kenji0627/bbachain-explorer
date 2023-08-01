// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey, BlockResponse } from "@bbachain/web3.js";
import { MAINNET_URL, TESTNET_URL } from "hooks/useCluster";

type Blocks = {
  blocks: BlockResponse[];
  next: number;
};

type Query = {
  block: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Blocks>
) {
  const query = <Query>(<unknown>req.query);
  const connection = new Connection(TESTNET_URL, "confirmed");
  const lastBlock = await connection.getBlockHeight();
  const end = Number(query.block) || lastBlock;
  const blocks = await connection.getBlocks(end - 25, end);
  const result = await Promise.all(
    blocks.map(async (block) => {
      const blockData = await connection.getBlock(block);
      return blockData;
    })
  );
  res.status(200).json({
    blocks: result.reverse(),
    next: Number(end - 26),
  });
}
