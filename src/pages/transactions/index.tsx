import type { NextPage } from "next";
import Head from "next/head";
import { TransactionsView } from "views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>BBASCAN | Block Explorer</title>
        <meta name="description" content="BBASCAN | Block Explorer" />
      </Head>
      <TransactionsView />
    </div>
  );
};

export default Home;
