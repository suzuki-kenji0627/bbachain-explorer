import type { NextPage } from "next";
import Head from "next/head";
import { BlocksView } from "views";

const BlocksPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>BBASCAN | Block Explorer</title>
        <meta name="description" content="BBASCAN | Block Explorer" />
      </Head>
      <BlocksView />
    </div>
  );
};

export default BlocksPage;
