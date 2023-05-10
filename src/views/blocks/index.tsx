// Next, React
import { BlockResponse } from "@bbachain/web3.js";
import { Box, Button, Pagination } from "@mui/material";
import { LoadingCard } from "components/common/LoadingCard";
import { FC, useEffect, useState } from "react";

export const BlocksView: FC = ({}) => {
  const [blocks, setBlocks] = useState<BlockResponse[]>([] as BlockResponse[]);
  const [block, setBlock] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const callAPI = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/latest_blocks?block=${block}`);
      const data = await res.json();
      console.log(data.blocks);
      setBlocks([...blocks, ...data.blocks]);
      setBlock(data.next);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowMore = () => {
    callAPI();
  };

  useEffect(() => {
    callAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card-body">
      <h2 className="card-title">Latest Blocks</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Block</th>
              <th>Block Hash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => {
              return (
                <tr key={block.blockhash}>
                  <th>
                    <div>
                      <div className="font-bold">
                        <a href={`/block/${block.parentSlot}`}>
                          {block.parentSlot}
                        </a>
                      </div>
                      <div className="text-sm opacity-50"></div>
                    </div>
                  </th>
                  <td>{block.blockhash}</td>
                  <td>{block.blockTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="grid justify-items-center space-y-2 mt-2">
          {loading && <LoadingCard message="Latest Blocks are Loading..." />}
          <Button onClick={handleShowMore}>Show more</Button>
        </div>
      </div>
    </div>
  );
};
