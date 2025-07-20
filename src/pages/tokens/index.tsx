import type { NextPage } from "next";
import Head from "next/head";
import { TokensView } from "views";

const TokensPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Tokens | Block Explorer</title>
        <meta name="description" content="BBAChain Tokens | Block Explorer" />
      </Head>
      <TokensView />
    </div>
  );
};

export default TokensPage;
