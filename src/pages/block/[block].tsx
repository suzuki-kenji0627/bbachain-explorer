import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { BlockDetailView } from "views/block-detail";

const BlockDetail: NextPage = (props) => {
  const router = useRouter();
  const block = router.query.block;

  if (!block) {
    return null;
  }

  const blockNumber = parseInt(`${block}`);

  return (
    <div>
      <Head>
        <title>Block {blockNumber} | Block Explorer</title>
        <meta name="description" content={`Block ${blockNumber} | Block Explorer`} />
      </Head>
      <BlockDetailView block={blockNumber} />
    </div>
  );
};

export default BlockDetail;
