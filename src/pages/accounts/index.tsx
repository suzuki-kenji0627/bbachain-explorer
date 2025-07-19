import type { NextPage } from "next";
import Head from "next/head";
import { AccountsView } from "views";

const BlocksPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Top Accounts | Block Explorer</title>
        <meta name="description" content="BBAChain Explorer | Block Explorer" />
      </Head>
      <AccountsView />
    </div>
  );
};

export default BlocksPage;
