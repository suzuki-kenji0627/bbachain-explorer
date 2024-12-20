import type { NextPage } from "next";
import Head from "next/head";
import { TransactionsView } from "views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Transactions | Block Explorer</title>
        <meta name="description" content="Transactions | Block Explorer" />
      </Head>
      <TransactionsView />
    </div>
  );
};

export default Home;
